package app

import (
	"errors"
	"io"

	"text/template"

	"net/http"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/alexbrazier/go-url/api/handler"
	"github.com/alexbrazier/go-url/api/slackbot"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// Init sets up all and creates routes
func Init(e *echo.Echo) {
	h := &handler.Handler{}

	appConfig := config.GetConfig()
	if appConfig.Auth.Enabled {
		// Require authentication to be able to access routes
		h.AuthInit(e)
	}

	e.Use(h.IPRestrict)

	// Serve public files at the /go route
	g := e.Group("/go")
	g.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  "public",
		HTML5: true,
	}))

	// Redirect route url to /go
	e.GET("/", func(c echo.Context) error {
		return c.Redirect(http.StatusTemporaryRedirect, "/go")
	})

	// Health route for monitoring
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"UP": true,
		})
	})

	// Setup routes
	e.GET("/opensearch.xml", h.Opensearch)
	e.GET("/:key", h.Url)
	e.GET("/*", h.Url)
	e.POST("/:key", h.CreateUrl)
	e.PUT("/:key", h.UpdateUrl)

	e.GET("/api/search", h.Search)
	e.GET("/api/search/suggest", h.SearchSuggestions)
	e.GET("/api/popular", h.Popular)
	e.GET("/api/url/:key", h.GetURL)

	if appConfig.Slack.SigningSecret != "" {
		e.POST("/api/slack", h.SlackCommand)
	}

	setupTemplates(e)

	if appConfig.Slack.Token != "" {
		s := &slackbot.SlackBot{}
		go s.Init()
	}
}

// TemplateRegistry ...
type TemplateRegistry struct {
	templates map[string]*template.Template
}

// setupTempletes adds the html templates required for the app, currently only one
func setupTemplates(e *echo.Echo) {
	templates := make(map[string]*template.Template)
	// This template is used to open multiple urls at the same time in different tabs
	// It works by using JavaScript window.open for all extra urls, then redirecting
	// the page to the current url
	// It will also detect a popup blocker and give instructions to allow popups for the site
	templates["multiple.html"] = template.Must(template.New("multiple.html").Parse(`
		<html><head><script>
			window.onload = function() {
				var popUp;
				{{range .urls}}
				popUp = window.open('{{.}}');
				{{end}}
				if (popUp == null || typeof(popUp)=='undefined') {
					window.open('{{.first_url}}')
					document.body.innerHTML = '<h1>Pop-ups appear to be blocked. Pop-ups need to be enabled to open multiple pages</h1>' +
						'<p>In Chrome click the pop-up icon on the right side of the url bar and select "Always allow pop-ups and redirects from ' + window.location.origin + '".</p>' +
						'<p>In Safari right click on the pop-up icon on the right side of the url bar, then select "Settings for this website", then under "Pop-up windows" select "Allow".</p>' +
						'<p>In Firefox select preferences from the dropdown bar that appears, then select "Allow pop-ups for ' + window.location.origin + '".</p>'
				} else {
					window.location.replace('{{.first_url}}');
				}
			};
		</script></head><body></body></html>
	`))
	templates["opensearch.xml"] = template.Must(template.New("opensearch.xml").Parse(
		`<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
	<ShortName>Go</ShortName>
	<Description>Search Go</Description>
	<InputEncoding>UTF-8</InputEncoding>
	<OutputEncoding>UTF-8</OutputEncoding>
	<Image width="16" height="16" type="image/x-icon">{{.domain}}/favicon.ico</Image>
	<Image width="64" height="64" type="image/png">{{.domain}}/logo-64x64.png</Image>
	<Url type="application/x-suggestions+json" method="GET" template="{{.domain}}/api/search/suggest">
		<Param name="q" value="{searchTerms}" />
	</Url>
	<Url type="text/html" method="GET" template="{{.domain}}/{searchTerms}"></Url>
	<Url type="application/opensearchdescription+xml" rel="self" template="{{.domain}}/opensearch.xml" />
	<moz:SearchForm>{{.domain}}/go</moz:SearchForm>
</OpenSearchDescription>`,
	))

	t := &TemplateRegistry{
		templates: templates,
	}
	e.Renderer = t
}

// Template html template struct
type Template struct {
	templates *template.Template
}

// Render renders the specified template
func (t *TemplateRegistry) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	tmpl, ok := t.templates[name]
	if !ok {
		err := errors.New("Template not found -> " + name)
		return err
	}

	return tmpl.ExecuteTemplate(w, name, data)
}

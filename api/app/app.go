package app

import (
	"io"

	"text/template"

	"net/http"

	"github.com/Babylonpartners/go-url/api/config"
	"github.com/Babylonpartners/go-url/api/handler"
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

	// Setup routes
	e.GET("/:key", h.Url)
	e.POST("/:key", h.CreateUrl)
	e.PUT("/:key", h.UpdateUrl)

	e.GET("/api/search", h.Search)
	e.GET("/api/search/suggest", h.SearchSuggestions)
	e.GET("/api/popular", h.Popular)

	setupTemplates(e)
}

// setupTempletes adds the html templates required for the app, currently only one
func setupTemplates(e *echo.Echo) {
	// This template is used to open multiple urls at the same time in different tabs
	// It works by using JavaScript window.open for all extra urls, then redirecting
	// the page to the current url
	// It will also detect a popup blocker and give instructions to allow popups for the site
	multiple := template.Must(template.New("multiple").Parse(`
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

	t := &Template{
		templates: multiple,
	}
	e.Renderer = t
}

// Template html template struct
type Template struct {
	templates *template.Template
}

// Render renders the specified template
func (t *Template) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

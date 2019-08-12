package handler

import (
	"net/http"

	"fmt"
	"strings"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/alexbrazier/go-url/api/model"
	"github.com/alexbrazier/go-url/api/utils"
	"github.com/labstack/echo"
)

func remove(s []string, r string) []string {
	for i, v := range s {
		if v == r {
			return append(s[:i], s[i+1:]...)
		}
	}
	return s
}

func (h *Handler) getSetDifference(keys []string, found []*model.URL) []string {
	newKeys := keys
	for _, item := range found {
		newKeys = remove(newKeys, item.Key)
	}
	return newKeys
}

// Url is the handler function for finding a url
// It will redirect the user to the desired url if one exists
func (h *Handler) Url(c echo.Context) (err error) {
	key := c.Request().URL.Path[1:]
	keys := strings.Split(key, ",")

	u, err := urlModel.GetUrlsFromKeys(keys)

	if err != nil {
		return err
	}

	if len(keys) != len(u) {
		if c.Request().Header.Get("Content-Type") != "application/json" {
			missing := h.getSetDifference(keys, u)
			message := fmt.Sprintf("/go/%s?message=%s was not found in the database", missing[0], strings.Join(missing, ", "))
			return c.Redirect(http.StatusTemporaryRedirect, message)
		}
		return c.JSON(http.StatusNotFound, map[string]interface{}{
			"message":  "One or more of the links provided are invalid",
			"provided": keys,
			"valid":    u,
		})
	}

	// If any of the returned keys are aliases then resolve the aliases
	var resolvedUrls []string
	var aliases []string
	for _, u2 := range u {
		if len(u2.Alias) > 0 {
			aliases = append(aliases, u2.Alias...)
			keys = append(keys, u2.Alias...)
		} else {
			resolvedUrls = append(resolvedUrls, u2.URL)
		}
	}
	if len(aliases) > 0 {
		aliasUrls, _ := urlModel.GetUrlsFromKeys(aliases)
		for _, u3 := range aliasUrls {
			resolvedUrls = append(resolvedUrls, u3.URL)
		}
	}

	// Increment the view count in the background as we don't want to delay the user
	// and even if it fails, it shouldn't stop the redirect
	go urlModel.IncrementViewCount(keys)

	if len(resolvedUrls) > 1 {
		firstURL := resolvedUrls[0]
		remaining := make([]string, len(resolvedUrls)-1)
		for i := 0; i < len(resolvedUrls)-1; i++ {
			remaining[i] = resolvedUrls[i+1]
		}

		data := map[string]interface{}{
			"first_url": firstURL,
			"urls":      remaining,
		}

		return c.Render(http.StatusOK, "multiple.html", data)
	}

	return c.Redirect(http.StatusTemporaryRedirect, resolvedUrls[0])
}

// isAlias checks if the keys passed in are aliases
// returns error if an alias of an alias is used
func (h *Handler) isAlias(alias string) (bool, error) {
	keys := strings.Split(alias, ",")
	u, err := urlModel.GetUrlsFromKeys(keys)
	if err != nil {
		return false, err
	}
	if len(keys) != len(u) {
		message := fmt.Sprintf("One or more of the urls or aliases provided are invalid")
		return false, echo.NewHTTPError(http.StatusBadRequest, message)
	}

	for _, key := range u {
		if key.URL == "" {
			message := fmt.Sprintf("You cannot alias an alias. '%s' is already an alias", key.Key)
			return false, echo.NewHTTPError(http.StatusBadRequest, message)
		}
	}
	return true, nil
}

func (h *Handler) validateUrl(c echo.Context) (*model.URL, error) {
	key := strings.ToLower(c.Param("key"))
	if valid := ValidateKey(key); !valid {
		message := fmt.Sprint("The key provided is not valid. It can only contain letters, numbers, _ and -")
		return nil, echo.NewHTTPError(http.StatusBadRequest, message)
	}
	u := &model.URL{
		Key: key,
	}

	if err := c.Bind(u); err != nil {
		fmt.Println("Error binding")
		return nil, err
	}

	// Validation
	if u.URL == "" {
		message := "url or alias is required"
		return nil, echo.NewHTTPError(http.StatusBadRequest, message)
	}
	_, err := utils.ValidateURL(u.URL)
	if err != nil {
		// Not a URL, let's check if it's an alias
		alias, err := h.isAlias(u.URL)
		if err != nil {
			return nil, err
		}
		// Swap alias and url fields if we have an alias
		if alias {
			u.Alias = strings.Split(u.URL, ",")
			u.URL = ""
			return u, nil
		}

		return nil, echo.NewHTTPError(http.StatusBadRequest, "Invalid url or alias provided")
	}
	for _, host := range config.GetConfig().BlockedHosts {
		same, err := utils.SameHost(host, u.URL)
		if err != nil {
			return nil, echo.NewHTTPError(http.StatusInternalServerError, "Error parsing URL")
		}
		if same {
			return nil, echo.NewHTTPError(http.StatusBadRequest, "You cannot add a URL with this hostname")
		}
	}

	return u, nil
}

func (h *Handler) UpdateUrl(c echo.Context) error {
	u, err := h.validateUrl(c)
	if err != nil {
		return err
	}
	if err := u.Update(); err != nil {
		return err
	}
	return c.JSON(http.StatusOK, u)
}

func (h *Handler) CreateUrl(c echo.Context) error {
	u, err := h.validateUrl(c)
	if err != nil {
		return err
	}
	// Save post in database
	if err := u.Save(); err != nil {
		message := fmt.Sprintf("%s already exists. To update the url please search for it and use the edit button.", u.Key)
		return echo.NewHTTPError(http.StatusBadRequest, message)
	}
	return c.JSON(http.StatusOK, u)
}

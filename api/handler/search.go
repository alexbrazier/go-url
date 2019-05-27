package handler

import (
	"net/http"
	"strings"

	"github.com/alexbrazier/go-url/api/config"
	"github.com/labstack/echo"
)

const defaultLimit = 15

// Search finds urls that are similar to the search query param q
func (h *Handler) Search(c echo.Context) error {
	query := strings.ToLower(c.QueryParam("q"))
	u, err := urlModel.Search(query, defaultLimit)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, u)
}

// SearchSuggestions returns suggestions in the opensearch expected format
// This allows browsers to auto suggest results from the url bar
// Format ["searchterm", [array of suggestoins]]
func (h *Handler) SearchSuggestions(c echo.Context) error {
	query := strings.ToLower(c.QueryParam("q"))
	u, err := urlModel.Search(query, defaultLimit)
	if err != nil {
		return err
	}
	var suggestions []string
	for _, url := range u {
		suggestions = append(suggestions, url.Key)
	}
	var result []interface{}
	result = append(result, query)
	result = append(result, suggestions)

	return c.JSON(http.StatusOK, result)
}

// Opensearch renders opensearch.xml page to tell the browser where to
// access search urls
func (h *Handler) Opensearch(c echo.Context) error {
	appConfig := config.GetConfig()
	data := map[string]interface{}{
		"domain": appConfig.AppURI,
	}
	return c.Render(http.StatusOK, "opensearch.xml", data)
}

// Popular finds URLs with the most views
func (h *Handler) Popular(c echo.Context) error {
	limit := 30
	u, err := urlModel.GetMostPopular(limit)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, u)
}

// GetURL finds an exact matching url if it exists
func (h *Handler) GetURL(c echo.Context) error {
	key := strings.ToLower(c.Param("key"))
	u, err := urlModel.Find(key)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, u)
}

package handler

import (
	"net/http"
	"strings"

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

// Popular finds URLs with the most views
func (h *Handler) Popular(c echo.Context) error {
	u, err := urlModel.GetMostPopular(defaultLimit)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, u)
}

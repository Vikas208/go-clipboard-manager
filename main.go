package main

import (
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	DB "github.com/Vikas208/Clipboard/pkg/database"
	keyBoard "github.com/Vikas208/Clipboard/pkg/keyboard"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	// Initialize Database
	DB.InitDB()

	// Create an instance of the app structure
	// app := NewApp()

	keyboardApp := keyBoard.NewKeyBoard()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "clipboard",
		Width:  720,
		Height: 480,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup: func(ctx context.Context) {
			keyboardApp.SetContext(ctx)

		},
		Bind: []interface{}{
			// app,
			keyboardApp,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}

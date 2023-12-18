package clipboard

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	hook "github.com/robotn/gohook"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
)

type applicationContext struct {
	ctx context.Context
}

func GetJsonDataOfClipboard(clipboardData interface{}) []byte {
	jsonData, err := json.Marshal(clipboardData)
	if err != nil {
		log.Fatal(err)
	}

	return jsonData
}

func printInJsonFormate(clipboardData TClipboard) {
	// Print the JSON data
	fmt.Println("JSON data:")
	fmt.Println(string(GetJsonDataOfClipboard(clipboardData)))
}

func pushItemsToClipboard(clipboardData *TClipboard, itemID string, newItem string) {
	if clipboardItem, exists := (*clipboardData)[itemID]; exists {
		clipboardItem.Items = append([]string{newItem}, clipboardItem.Items...)
		(*clipboardData)[itemID] = clipboardItem
	}
}

func (a *applicationContext) emitDataToFrontend(id string, clipboardData *TClipboard, data string) {
	pushItemsToClipboard(clipboardData, id, data)
	item := ClipboardItem{
		ID:    id,
		Items: []string{string(data)},
	}
	runtime.EventsEmit(a.ctx, "clipboard", GetJsonDataOfClipboard(item))

}

func (a *applicationContext) clipboardInit(clipboardData *TClipboard) {

	// Watch for clipboard changes
	// Run in background
	go func() {
		err := clipboard.Init()
		if err != nil {
			panic(err)
		}
		ch := clipboard.Watch(context.TODO(), clipboard.FmtText)
		for data := range ch {
			if data == nil {
				continue
			}
			fmt.Println("Clipboard Data", string(data))
			a.emitDataToFrontend("common", clipboardData, string(data))
		}
	}()

	// Watch for clipboard change on specific Key Bindings

	// go func() {

	hook.Register(hook.KeyDown, []string{"ctrl", "c", "1"}, func(e hook.Event) {
		data := clipboard.Read(clipboard.FmtText)
		a.emitDataToFrontend("1", clipboardData, string(data))
	})

	hook.Register(hook.KeyDown, []string{"ctrl", "c", "2"}, func(e hook.Event) {
		data := clipboard.Read(clipboard.FmtText)
		a.emitDataToFrontend("2", clipboardData, string(data))
	})

	s := hook.Start()
	defer hook.End()
	<-hook.Process(s)
	// }()
}

func Init(ctx context.Context) {
	// initialize all slots with previous data from file
	// initialize clipboard
	app := applicationContext{ctx: ctx}
	clipboardData := TClipboard{
		"1":      {"1", make([]string, 50)},
		"2":      {"2", make([]string, 50)},
		"3":      {"3", make([]string, 50)},
		"4":      {"4", make([]string, 50)},
		"5":      {"5", make([]string, 50)},
		"6":      {"6", make([]string, 50)},
		"7":      {"7", make([]string, 50)},
		"8":      {"8", make([]string, 50)},
		"common": {"common", make([]string, 50)},
	}
	app.clipboardInit(&clipboardData)
}

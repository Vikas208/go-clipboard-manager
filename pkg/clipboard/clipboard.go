package clipboard

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"sync"

	"github.com/Vikas208/Clipboard/pkg/constant"
	hook "github.com/robotn/gohook"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.design/x/clipboard"
)

type ApplicationContext struct {
	ctx context.Context
}

func GetJsonDataOfClipboard(clipboardData interface{}) []byte {
	jsonData, err := json.Marshal(clipboardData)
	if err != nil {
		log.Fatal(err)
	}

	return jsonData
}

func pushItemsToClipboard(clipboardData *TClipboard, itemID string, newItem string) {
	if clipboardItem, exists := (*clipboardData)[itemID]; exists {
		// check the elements size not greater than MAX_SIZE
		fmt.Printf("length of %s is %d\n", itemID, len(clipboardItem.Items))
		if len(clipboardItem.Items) >= constant.MAX_SIZE {
			clipboardItem.Items = clipboardItem.Items[1:]
		}
		clipboardItem.Items = append([]string{newItem}, clipboardItem.Items...)
		(*clipboardData)[itemID] = clipboardItem
		// fmt.Println("Pushed item to clipboard", clipboardItem)
	}
	fmt.Println("JSON data:")
	fmt.Println(string(GetJsonDataOfClipboard(clipboardData)))
}

func (a *ApplicationContext) emitDataToFrontend(id string, clipboardData *TClipboard, data string, eventName string) {
	pushItemsToClipboard(clipboardData, id, data)
	item := ClipboardItem{
		ID:    id,
		Items: []string{string(data)},
	}
	runtime.EventsEmit(a.ctx, eventName, GetJsonDataOfClipboard(item))
}

func (a *ApplicationContext) clipboardInit(clipboardData *TClipboard) {

	// create channel for communicate between go routines
	var COPIED_THROUGH_SLOTS_FLAG = 0

	var wg sync.WaitGroup
	wg.Add(2)
	// Watch for clipboard changes
	// Run in background
	go func() {
		defer wg.Done()
		err := clipboard.Init()
		if err != nil {
			panic(err)
		}
		ch := clipboard.Watch(context.TODO(), clipboard.FmtText)
		for data := range ch {
			if data == nil || COPIED_THROUGH_SLOTS_FLAG == constant.COPIED_THROUGH_SLOTS {
				COPIED_THROUGH_SLOTS_FLAG = 0
				continue
			}
			fmt.Println("Clipboard Data", string(data))
			a.emitDataToFrontend("common", clipboardData, string(data), constant.CLIPBOARD_EVENT)
		}
	}()

	// Watch for clipboard change on specific Key Bindings

	go func() {
		defer wg.Done()

		registerKeyBinding := func(slot string) {
			hook.Register(hook.KeyDown, []string{"ctrl", "c", slot}, func(e hook.Event) {
				data := clipboard.Read(clipboard.FmtText)
				COPIED_THROUGH_SLOTS_FLAG = constant.COPIED_THROUGH_SLOTS
				a.emitDataToFrontend(slot, clipboardData, string(data), constant.CLIPBOARD_SLOT_EVENT)
			})
		}

		// Register key bindings for slots 1 to 8
		for i := 1; i <= 8; i++ {
			registerKeyBinding(fmt.Sprintf("%d", i))
		}

		s := hook.Start()
		defer hook.End()
		<-hook.Process(s)
	}()

	wg.Wait()
}

func (a *ApplicationContext) Init(ctx context.Context) {
	// initialize all slots with previous data from file
	// initialize clipboard
	a.ctx = ctx
	clipboardData := TClipboard{
		"1":      {"1", []string{}},
		"2":      {"2", []string{}},
		"3":      {"3", []string{}},
		"4":      {"4", []string{}},
		"5":      {"5", []string{}},
		"6":      {"6", []string{}},
		"7":      {"7", []string{}},
		"8":      {"8", []string{}},
		"common": {"common", []string{}},
	}

	a.clipboardInit(&clipboardData)
}

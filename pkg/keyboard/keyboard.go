package keyboard

import (
	"context"
	"fmt"

	_ "github.com/Vikas208/Clipboard/pkg/database"
)

type KeyboardType struct {
	Id   int    `json:"id"`
	Key  string `json:"key"`
	Slot string `json:"slot"`
}

type Application struct {
	ctx context.Context
}

func NewKeyBoard() *Application {
	return &Application{}
}

func (a *Application) SetContext(ctx context.Context) {
	a.ctx = ctx
}

func (a *Application) AddKeyBindings(binding *KeyboardType) {
	fmt.Printf("KEY: +%v", binding)
}

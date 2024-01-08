package database

import (
	"fmt"

	"github.com/Vikas208/Clipboard/pkg/constant"
)

func initializeSlotTable() {

	createSlotsTable := "CREATE TABLE IF NOT EXISTS " + constant.SLOTS_TABLE + " (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
	fmt.Printf("createSlotsTable: %s\n", createSlotsTable)
	fmt.Printf("DB: %v\n", DB)
	_, err := DB.Exec(createSlotsTable)
	if err != nil {
		panic(err)
	}

	fmt.Println("Created slots table")

	arr := []string{constant.SLOT_1, constant.SLOT_2, constant.SLOT_3, constant.SLOT_4, constant.SLOT_5, constant.SLOT_6, constant.SLOT_7, constant.SLOT_8, constant.SLOT_COMMON}

	for _, name := range arr {
		_, err := DB.Exec("INSERT OR IGNORE INTO slots (name) VALUES (?)", name)
		if err != nil {
			panic(err)
		}
	}
}

func initializeKeyBindingsTable() {
	createKeyBindingsTable := fmt.Sprintf(`
	CREATE TABLE IF NOT EXISTS %s (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slot_id INTEGER NOT NULL,
		key TEXT UNIQUE DEFAULT '',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (slot_id) REFERENCES %s (id)
	);
	`, constant.KEY_BINDINGS, constant.SLOTS_TABLE)

	_, err := DB.Exec(createKeyBindingsTable)
	if err != nil {
		panic(err)
	}

	fmt.Println("Created keybindings table")
}

func initializeClipboardTable() {
	createClipboardTable := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slot_id INTEGER NOT NULL,
		text_data TEXT,
		blob_data BLOB,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (slot_id) REFERENCES %s (id)
	);
	`, constant.CLIPBOARD_TABLE, constant.SLOTS_TABLE)

	_, err := DB.Exec(createClipboardTable)
	if err != nil {
		panic(err)
	}

	fmt.Println("Created clipboard table")
}

func InitializeTables() {

	// CREATE TABLES

	// CREATE SLOT
	initializeSlotTable()

	// CREATE KEY BINDINGS
	initializeKeyBindingsTable()

	// CREATE CLIPBOARD
	initializeClipboardTable()
}

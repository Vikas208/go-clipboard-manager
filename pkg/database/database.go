package database

import (
	"database/sql"
	"fmt"

	"github.com/Vikas208/Clipboard/pkg/constant"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	_DB, err := sql.Open("sqlite3", constant.DB_NAME)
	if err != nil {
		panic(err)
	}
	DB = _DB
	fmt.Println("Connected!", DB)
	InitializeTables()
	defer DB.Close()
}

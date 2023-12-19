package clipboard

type ClipboardItem struct {
	ID    string   `json:"id"`
	Items []string `json:"Items"`
}

type TClipboard map[string]ClipboardItem

const (
	ClipboardEvent = "clipboard"
	ClipboardSlot  = "slotClipboardChanges"
)

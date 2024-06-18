import React, { useRef, useEffect, useState } from 'react';
import JoditEditor from 'jodit-react';
import Picker from 'emoji-picker-react';

const Editor = ({ setContent }) => {
    const editorRef = useRef(null);
    const pickerRef = useRef(null);
    const [showPicker, setShowPicker] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const jodit = editorRef.current;
        const handleFocus = () => {
            setCursorPosition(jodit.editor.selection.save());
        };

        jodit?.editor?.events?.on('focus', handleFocus);

        return () => {
            jodit?.editor?.events?.off('focus', handleFocus);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowPicker(false);
        }
    };

    const onEmojiClick = (event, emojiObject) => {
        const jodit = editorRef.current;
        if (jodit && jodit.editor && cursorPosition) {
            jodit.editor.selection.restore(cursorPosition);
            jodit.editor.selection.insertHTML(emojiObject.emoji);
            jodit.editor.selection.focus();
        }
        setShowPicker(false);
    };

    const config = {
        readonly: false,
        height: 300,
        toolbarButtonSize: "large",
        uploader: {
            insertImageAsBase64URI: true,
            imagesExtensions: ["jpg", "png", "jpeg", "gif"],
            url: 'path_to_your_backend_file_upload_endpoint',
            format: 'json',
            method: 'DT',
            headers: {
                'Authorization': 'your_authorization_token_or_other_needed_headers'
            },
            filesVariableName: () => 'files'
        },
        filebrowser: {
            ajax: {
                url: 'path_to_your_backend_file_browser_endpoint'
            }
        },
        extraButtons: [
            {
                name: 'emoji',
                iconURL: 'https://icons.iconarchive.com/icons/emojione/emoji-one/1024/smiley-icon.png',
                exec: () => {
                    setShowPicker(prevState => !prevState);
                    const editor = editorRef.current;
                    if (editor) {
                        setTimeout(() => {
                            editor.focus(); // Assuming focus() is the correct method
                        }, 0);
                    }
                }
            }
        ]
    };

    return (
        <div>
            <JoditEditor
                ref={editorRef}
                config={config}
                tabIndex={1}
                onBlur={newContent => setContent(newContent)}  // Update content state only when leaving the editor
            />
            {showPicker && (
                <div ref={pickerRef}>
                    <Picker
                        onEmojiClick={onEmojiClick}
                        disableAutoFocus={false}  // Forhindrer auto-fokusering når komponenten mountes
                        disableSearchBar={false}  // Skjuler søgefeltet, hvis sat til true
                        disableSkinTonePicker={false}  // Skjuler skin tone vælgeren, hvis sat til true
                        groupNames={{}}  // Definerer brugerdefinerede navne for emoji-grupper
                        groupVisibility={{}}  // Bestemmer hvilke emoji-grupper der skal vises
                        lazyLoadEmojis={false}  // Aktiverer lazy loading af emojis
                        native={false}  // Bruger native system-emojis i stedet for Twitter emojis
                        pickerStyle={{}}  // Tilpasset CSS for emoji-picker
                        preload={true}  // Loader emojis i forvejen, når komponenten mountes
                        searchPlaceholder="Søg Efter Emojies"  // Placeholder tekst for søgefeltet
                        skinTonesDisabled={false}  // Deaktiver valg af skin tones hvis sat til true
                        topBarProps={{}}  // Indstillinger for top-baren i emoji-picker
                        twaHost="https://twemoji.maxcdn.com/v/13.0.1/72x72/"  // URL til hosting af emojis, hvis du ikke ønsker at bruge default
                    />
                </div>
            )}
        </div>
    );
};

export default Editor;

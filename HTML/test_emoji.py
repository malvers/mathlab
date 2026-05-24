from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.firefox.launch(headless=True)
    page = browser.new_page()
    page.goto('http://127.0.0.1:8124/vgp/vgpchat.html?debug=1')
    page.wait_for_selector('#msg-emoji', state='visible')
    
    # Enable console log tracking
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    
    # Click the emoji button
    print("Clicking #msg-emoji in Firefox...")
    page.click('#msg-emoji')
    
    # Wait a moment to see if panel opens
    page.wait_for_timeout(1000)
    
    panel_class = page.evaluate("document.getElementById('emoji-panel').className")
    print(f"emoji-panel class is: '{panel_class}'")
    
    # Click the name emoji button
    print("Clicking #name-emoji in Firefox...")
    page.click('#name-emoji')
    page.wait_for_timeout(1000)
    
    avatar_choice_class = page.evaluate("document.getElementById('avatar-choice').className")
    print(f"avatar-choice class is: '{avatar_choice_class}'")
    
    browser.close()

import json
import sys
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement

browser: webdriver.Chrome
wait: WebDriverWait
data: dict = {}

def init_browser() -> None:
  global browser, wait
  options = Options()
  bin_path = data.get("CHROME_BINARY_PATH")
  if bin_path:
    options.binary_location = bin_path
  browser = webdriver.Chrome(service=Service(), options=options)
  wait = WebDriverWait(browser, 10)

def navigate() -> None:
  url = data.get("INDEX_HTML") or data.get("APP_URL")
  if not url or not url.startswith(("http://", "https://")):
    raise ValueError("Invalid URL")
  browser.get(url)
  wait.until(lambda d: d.execute_script("return document.readyState") == "complete")

def set_value(el: WebElement, val: str) -> None:
  if not val:
    return
  browser.execute_script("""
    const el = arguments[0];
    const proto = el.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;

    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, arguments[1]);
    el.dispatchEvent(new Event('input', {bubbles:true}));
    el.dispatchEvent(new Event('change', {bubbles:true}));
  """, el, val)

def select_option(el: WebElement, val: str) -> None:
  if not val:
    return
  browser.execute_script("""
    const select = arguments[0], val = arguments[1];
    const option = Array.from(select.options)
      .find(o => o.text.trim() === val || o.value.trim() === val);
    if (option) {
      select.value = option.value;
      select.dispatchEvent(new Event('change', {bubbles: true}));
    }
  """, el, val)

def get_entry(container_id: str, i: int) -> WebElement:
  return browser.find_element(By.ID, container_id)\
    .find_elements(By.CSS_SELECTOR, ".multi-entry")[i]

def fill_personal(p: dict) -> None:
  set_value(browser.find_element(By.ID, "fullname"), p.get("FULLNAME", ""))
  set_value(browser.find_element(By.ID, "city"), p.get("CITY", ""))
  set_value(browser.find_element(By.ID, "email"), p.get("EMAIL", ""))
  set_value(browser.find_element(By.ID, "objective"), p.get("OBJECTIVE", ""))
  set_value(browser.find_element(By.ID, "summary"), p.get("SUMMARY", ""))
  set_value(browser.find_element(By.ID, "technology"), p.get("TECHNOLOGY", ""))
  set_value(browser.find_element(By.ID, "telephone"), p.get("TELEPHONE", ""))

  state = p.get("STATE")
  if state:
    Select(browser.find_element(By.ID, "state")).select_by_value(state)

def fill_dynamic(container_id: str, button_id: str, items: list, fn) -> None:
  for i, item in enumerate(items):
    container = browser.find_element(By.ID, container_id)
    rows = container.find_elements(By.CSS_SELECTOR, ".multi-entry")

    if i >= len(rows):
      browser.find_element(By.ID, button_id).click()
      rows = container.find_elements(By.CSS_SELECTOR, ".multi-entry")

    fn(rows[i], item)

def fill_education(items: list[dict]) -> None:
  def fn(el, edu):
    inputs = el.find_elements(By.TAG_NAME, "input")
    values = [edu.get("INSTITUTION", ""), edu.get("COURSE", ""), edu.get("START", ""), edu.get("END", "")]
    for el_i, v in zip(inputs, values):
      set_value(el_i, v)

  fill_dynamic("educationContainer", "btnAddEducation", items, fn)

def fill_experience(items: list[dict]) -> None:
  def fn(el, exp):
    inputs = el.find_elements(By.TAG_NAME, "input")
    values = [exp.get("COMPANY", ""), exp.get("ROLE", ""), exp.get("START", ""), exp.get("END", "")]
    for el_i, v in zip(inputs, values):
      set_value(el_i, v)

    text_area = el.find_elements(By.TAG_NAME, "textarea")
    if text_area:
      set_value(text_area[0], exp.get("DESCRIPTION", ""))

  fill_dynamic("experienceContainer", "btnAddExperience", items, fn)

def fill_languages(items: list[dict]) -> None:
  def fn(el, lang):
    sel = el.find_elements(By.TAG_NAME, "select")
    if len(sel) >= 2:
      select_option(sel[0], lang.get("NAME", ""))
      select_option(sel[1], lang.get("LEVEL", ""))

  fill_dynamic("languagesContainer", "btnAddLanguage", items, fn)

def fill_courses(items: list[str]) -> None:
  def fn(el, course):
    set_value(el.find_element(By.TAG_NAME, "input"), course)

  fill_dynamic("coursesContainer", "btnAddCourse", items, fn)

def fill_links(items: list[str]) -> None:
  def fn(el, link):
    set_value(el.find_element(By.TAG_NAME, "input"), link)
 
  fill_dynamic("linksContainer", "btnAddLink", items, fn)

def fill_form() -> None:
  fill_personal(data)
  fill_education(data["EDUCATION"])
  fill_experience(data["EXPERIENCE"])
  fill_languages(data["LANGUAGES"])
  fill_courses(data["COURSES"])
  fill_links(data["LINKS"])

def generate(lang: str) -> None:
  select_option(browser.find_element(By.ID, "curriculumLanguage"), lang)
  time.sleep(0.5)
  wait.until(EC.element_to_be_clickable((By.ID, "btnGenerate"))).click()
  time.sleep(10)

def close() -> None:
  browser.quit()

def main() -> None:
  global data

  path = sys.argv[1]
  lang = sys.argv[2]

  with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

  init_browser()

  try:
    navigate()
    fill_form()
    generate(lang)
  finally:
    close()

if __name__ == "__main__":
  main()

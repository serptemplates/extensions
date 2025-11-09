# README

- If a topic page has 0 associated extensions, dont build/show the page
- If a category page has 0 associated extensions, dont build/show the page

## URL structure

```
extensions.serp.co/

# extensions
extensions.serp.co/extensions/
extensions.serp.co/extensions/[slug]/[id]/
- [id] comes from the chromestore extension ID (for all extensions except "serp" ones)
- [id] for "serp" (ours) is just "serp"

# topics (keyword terms)
extensions.serp.co/topics/
extensions.serp.co/best/[slug]/
- this is a "single topic" page (were just swapping out "topics" for "best" bc of KW in URL power)

# categories (pulled from google webstore)
extensions.serp.co/categories/
extensions.serp.co/categories/[slug]/
```

## Schema

- packages/app-core/src/db/schema.ts

## DATA

### Categories

- Productivity
- Communication
- Developer Tools
- Education
- Tools
- Workflow & Planning
- Lifestyle
- Art & Design
- Entertainment
- Games
- Household
- Just for Fun
- News & Weather
- Shopping
- Social Networking
- Travel
- Well-being
- Make Chrome Yours
- Accessibility
- Functionality & UI
- Privacy & Security

### Topics

```csv
slug,name
ad-blocker,Ad Blocker
amazon-asin-grabber,Amazon ASIN Grabber
auto-clicker,Auto Clicker
auto-refresher,Auto Refresher
auto-tab-switcher,Auto Tab Switcher
blur-screen,Blur Screen
bulk-email-sender,Bulk Email Sender
bulk-url-opener,Bulk URL Opener
chatgpt-sidebar,ChatGPT Sidebar
chrome-audio-capture,Chrome Audio Capture
clipboard-history,Clipboard History
clipboard-manager,Clipboard Manager
color-picker,Color Picker
cookie-editor,Cookie Editor
coupon-finder,Coupon Finder
custom-cursor,Custom Cursor
custom-progress-bar,Custom Progress Bar
dark-mode,Dark Mode
data-scraper,Data Scraper
email-finders,Email Finders
email-open-tracker,Email Open Tracker
focus-timer,Focus Timer
gmail-backup-tool,Gmail Backup Tool
grammar-checker,Grammar Checker
history-cleaner,History Cleaner
image-describer,Image Describer
line-reader-tool,Line Reader Tool
mouse-jiggler,Mouse Jiggler
password-generator,Password Generator
password-manager,Password Manager
pdf-editor,PDF Editor
pdf-reader,PDF Reader
pitch-changer,Pitch Changer
popup-blocker,Popup Blocker
price-monitoring,Price Monitoring
price-tracker,Price Tracker
recaptcha-solver,reCAPTCHA Solver
residential-vpn,Residential VPN
screen-recorder,Screen Recorder
screenshot-tool,Screenshot Tool
session-manager,Session Manager
snipping-tool,Snipping Tool
speed-reader,Speed Reader
split-screen,Split Screen
tab-manager,Tab Manager
task-tracker,Task Tracker
text-expander,Text Expander
text-simplifier,Text Simplifier
tracker-blocker,Tracker Blocker
transcribe-youtube,Transcribe YouTube Videos
translation-tool,Translation Tool
url-indexer,URL Indexer
user-agent-switcher,User Agent Switcher
video-popout,Video Popout
video-translator,Video Translator
visual-timer,Visual Timer
volume-booster,Volume Booster
volume-controller,Volume Controller
vpn,VPN
vpn-for-discord,VPN for Discord
vpn-for-pc,VPN for PC
vpn-for-school,VPN for School
wayfair-price-tracker,Wayfair Price Tracker
webtime-tracker,Webtime Tracker
youtube-adblocker,YouTube Adblocker
youtube-comment-finder,YouTube Comment Finder
123movies-downloader,123Movies Downloader
4shared-downloader,4shared Downloader
500px-downloader,500px Downloader
adobe-stock-downloader,Adobe Stock Downloader
alamy-downloader,Alamy Downloader
alltube-downloader,AllTube Downloader
alpha-porno-downloader,Alpha Porno Downloader
amazon-video-downloader,Amazon Video Downloader
anon-v-downloader,Anon-V Downloader
apk-downloader,APK Downloader
audio-downloader,Audio Downloader
audiomack-downloader,Audiomack Downloader
bandcamp-downloader,Bandcamp Downloader
beatport-downloader,Beatport Downloader
beatstars-downloader,BeatStars Downloader
beeg-downloader,Beeg Downloader
behance-downloader,Behance Downloader
bilibili-downloader,Bilibili Downloader
box-downloader,Box Downloader
brightcove-video-downloader,Brightcove Video Downloader
bulk-media-downloader,Bulk Media Downloader
canva-downloader,Canva Downloader
circle-downloader,Circle Downloader
clientclub-downloader,ClientClub Downloader
cobalt-downloader,Cobalt Downloader
coub-downloader,Coub Downloader
dailymotion-downloader,Dailymotion Downloader
deezer-downloader,Deezer Downloader
depositphotos-downloader,Depositphotos Downloader
disney-downloader,Disney Downloader
dreamstime-downloader,Dreamstime Downloader
dropbox-downloader,Dropbox Downloader
eporner-downloader,Eporner Downloader
erome-downloader,Erome Downloader
facebook-video-downloader,Facebook Video Downloader
fc2-downloader,FC2 Downloader
figma-downloader,Figma Downloader
flickr-downloader,Flickr Downloader
flowplayer-downloader,Flowplayer Downloader
freepik-downloader,Freepik Downloader
freesound-downloader,Freesound Downloader
getty-images-downloader,Getty Images Downloader
giphy-downloader,Giphy Downloader
gogoanime-downloader,GogoAnime Downloader
gohighlevel-downloader,GoHighLevel Downloader
gokollab-downloader,GoKollab Downloader
google-docs-downloader,Google Docs Downloader
google-drive-downloader,Google Drive Downloader
google-maps-downloader,Google Maps Downloader
gumroad-downloader,Gumroad Downloader
hls-video-downloader,HLS Video Downloader
hotstar-downloader,Hotstar Downloader
hudl-downloader,Hudl Downloader
hulu-downloader,Hulu Downloader
image-downloader,Image Downloader
imdb-downloader,IMDB Downloader
imgur-downloader,Imgur Downloader
instagram-downloader,Instagram Downloader
internet-archive-downloader,Internet Archive Downloader
iqiyi-downloader,iQiyi Downloader
issuu-downloader,Issuu Downloader
istock-downloader,iStock Downloader
jwplayer-video-downloader,JW Player Video Downloader
kajabi-video-downloader,Kajabi Video Downloader
khan-academy-downloader,Khan Academy Downloader
kick-clip-downloader,Kick Clip Downloader
linkedin-learning-downloader,LinkedIn Learning Downloader
livestream-downloader,Livestream Downloader
loom-video-downloader,Loom Video Downloader
lottiefiles-downloader,LottieFiles Downloader
m3u8-downloader,M3U8 Downloader
medal-downloader,Medal Downloader
mediafire-downloader,MediaFire Downloader
medium-downloader,Medium Downloader
mixcloud-downloader,Mixcloud Downloader
moodle-downloader,Moodle Downloader
mp3-downloader,MP3 Downloader
mp4-video-downloader,MP4 Video Downloader
musescore-downloader,MuseScore Downloader
netflix-downloader,Netflix Downloader
notion-downloader,Notion Downloader
odysee-downloader,Odysee Downloader
ok-downloader,OK Downloader
onlyfans-downloader,OnlyFans Downloader
open-video-downloader,Open Video Downloader
openload-downloader,Openload Downloader
pandora-downloader,Pandora Downloader
panopto-downloader,Panopto Downloader
pdf-downloader,PDF Downloader
periscope-downloader,Periscope Downloader
pexels-video-downloader,Pexels Video Downloader
pinterest-downloader,Pinterest Downloader
pixabay-downloader,Pixabay Downloader
pixieset-downloader,Pixieset Downloader
pixiv-downloader,Pixiv Downloader
pluralsight-downloader,Pluralsight Downloader
pond5-downloader,Pond5 Downloader
pornhub-downloader,Pornhub Downloader
prezi-downloader,Prezi Downloader
putlocker-downloader,Putlocker Downloader
qq-downloader,QQ Downloader
quizlet-downloader,Quizlet Downloader
rawpixel-downloader,Rawpixel Downloader
reddit-downloader,Reddit Downloader
redtube-downloader,RedTube Downloader
reverbnation-downloader,ReverbNation Downloader
rutube-downloader,Rutube Downloader
scribd-downloader,Scribd Downloader
scribe-downloader,Scribe Downloader
shutterstock-downloader,Shutterstock Downloader
sketchfab-downloader,Sketchfab Downloader
skool-video-downloader,Skool Video Downloader
slideshare-downloader,SlideShare Downloader
smugmug-downloader,SmugMug Downloader
smule-downloader,Smule Downloader
snapchat-video-downloader,Snapchat Video Downloader
soundclick-downloader,SoundClick Downloader
soundcloud-downloader,SoundCloud Downloader
spankbang-downloader,SpankBang Downloader
spotify-downloader,Spotify Downloader
sprout-video-downloader,Sprout Video Downloader
storyblocks-downloader,Storyblocks Downloader
streamable-downloader,Streamable Downloader
stripchat-video-downloader,Stripchat Video Downloader
substack-downloader,Substack Downloader
svg-downloader,SVG Downloader
teachable-video-downloader,Teachable Video Downloader
telegram-video-downloader,Telegram Video Downloader
tenor-downloader,Tenor Downloader
terabox-downloader,Terabox Downloader
thinkific-downloader,Thinkific Downloader
thumbnail-downloader,Thumbnail Downloader
tidal-downloader,Tidal Downloader
tiktok-downloader,TikTok Downloader
tnaflix-downloader,TNAFlix Downloader
torrent-downloader,Torrent Downloader
tubi-downloader,Tubi Downloader
tumblr-downloader,Tumblr Downloader
twitch-video-downloader,Twitch Video Downloader
twitter-video-downloader,Twitter Video Downloader
udemy-downloader,Udemy Downloader
unsplash-downloader,Unsplash Downloader
vectorstock-downloader,VectorStock Downloader
vevo-downloader,Vevo Downloader
video-downloader,Video Downloader
videohive-downloader,VideoHive Downloader
vidyard-downloader,Vidyard Downloader
vimeo-downloader,Vimeo Downloader
vk-video-downloader,VK Video Downloader
vod-downloader,VOD Downloader
wav-downloader,WAV Downloader
website-downloader,Website Downloader
weibo-downloader,Weibo Downloader
whop-video-downloader,Whop Video Downloader
wistia-video-downloader,Wistia Video Downloader
xhamster-downloader,xHamster Downloader
xnxx-downloader,XNXX Downloader
xtube-downloader,Xtube Downloader
xvideos-downloader,XVideos Downloader
yandex-downloader,Yandex Downloader
youku-downloader,Youku Downloader
youporn-downloader,YouPorn Downloader
youtube-downloader,YouTube Downloader
zoom-downloader,Zoom Downloader
```
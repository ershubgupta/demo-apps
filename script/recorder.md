ChatGPT Plus

Yesterday 6:16 PM

Reels (7).srt
File
oki have done with recording help me with editing, like text, overlay, b-roll etc, sharing srt, there are couple of intenational gap where im showing screen recording

1ba51bb3-7c0c-4e50-acbd-5648994589e0.png
59165850-f21c-4501-aaeb-540a166d9c2f.png
6fbf10c9-5190-4855-be1a-15d005852a2e.png

Race Condition(1).srt
File
sharing json for ur refence, once done mroe to next step

c732ae42-97fd-4618-a595-957c91318dbf.png
yes slow speed is better, normal is very fast and i added breakpoint, andworking as expetcd ,and one thing i noticied, user even interact with site during this like when exution paused i m able to increase the cart quantity, and when started next step it started form there not what it actually recorded, and let mvoe to next

b8c9da82-f4b6-4f99-990d-bc064d1ee12f.png
im not able to change the search term, i cant find a way to edit it, so point 1 worked, stuck in 2

5faeb7cf-2224-4f5f-854e-f55291e39ef9.png
ok now efit worked same way as u mentioned, and tried, and replay, got break becasue next step was dependt on the watch so what next?

119b6331-f732-482a-96f6-49019bac5274.png
help me how to add propertiy,

c7a54189-cf10-4fe1-a69d-37e8f0903446.png
3b2ea492-0bae-49d2-967c-795433005711.png
got failed

50b03c16-a7d3-48b6-b2f8-e2dcf2f1cc16.png
do i need to keep old step or remove and add new and im not getting how to add epxression

c0a2504e-f2b4-49ff-8563-2f31c0a67688.png
still error

e98b1996-edfd-478d-aab9-9bb3e7bffd87.png
this is what i can see in browser, and i dont like this text flow, make it more clear and human wise, "“Humne browser mein steps record kiye, but Recorder internally inhe actual automation instructions mein convert kar raha hai. Aur Show code se hum recording ke andar hi generated code inspect kar sakte hain.” ",
import { Locator, launch } from 'puppeteer'; // v25.0.0 or later
const browser = await launch();
const page = await browser.newPage();
const timeout = 5000;
page.setDefaultTimeout(timeout);
{
const targetPage = page;
await targetPage.setViewport({
width: 550,
height: 435
})
}
{
const targetPage = page;
await targetPage.goto('http://localhost:3010/debug-demos/cart-recorder');
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Login)'),
targetPage.locator("[data-testid='login-button']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"login-button\"])'),
targetPage.locator("**:scope >>> [data-testid='login-button']"),
targetPage.locator('::-p-text(Login)')
])
.setTimeout(timeout)
.click({
offset: {
x: 204,
y: 10.61248779296875,
},
});
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Search products)'),
targetPage.locator("[data-testid='product-search-input']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"product-search-input\"])'),
targetPage.locator(":scope >>> [data-testid='product-search-input']")
])
.setTimeout(timeout)
.click({
offset: {
x: 261.20000076293945,
y: 26.612503051757812,
},
});
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Search products)'),
targetPage.locator("[data-testid='product-search-input']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"product-search-input\"])'),
targetPage.locator("**:scope >>> [data-testid='product-search-input']")
])
.setTimeout(timeout)
.fill('watch');
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Sport Chronograph Watch[role=\"image\"])'),
targetPage.locator('article*:nth-of-type**(3) div.aspect-\[4\/3\]'),*
targetPage.locator('::-p-xpath(//[@data-testid=\"product-card-sport-chronograph-watch\"]/div[1])'),
targetPage.locator(':scope >>> article:nth-of-type(3) div.aspect-\[4\/3\]')
])
.setTimeout(timeout)
.click({
offset: {
x: 254.19999885559082,
y: 58.63749694824219,
},
});
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Add Sport Chronograph Watch to cart)'),
targetPage.locator("[data-testid='add-to-cart-button']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"add-to-cart-button\"])'),
targetPage.locator("**:scope >>> [data-testid='add-to-cart-button']"),
targetPage.locator('::-p-text(Add to Cart)')
])
.setTimeout(timeout)
.click({
offset: {
x: 223.20000076293945,
y: 10.212493896484375,
},
});
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Promo code)'),
targetPage.locator("[data-testid='coupon-input']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"coupon-input\"])'),
targetPage.locator(":scope >>> [data-testid='coupon-input']")
])
.setTimeout(timeout)
.click({
offset: {
x: 274.20000076293945,
y: 11.024993896484375,
},
});
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Promo code)'),
targetPage.locator("[data-testid='coupon-input']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"coupon-input\"])'),
targetPage.locator("**:scope >>> [data-testid='coupon-input']")
])
.setTimeout(timeout)
.fill('save10percent');
}
{
const targetPage = page;
await Locator.race([
targetPage.locator('::-p-aria(Apply Coupon)'),
targetPage.locator("[data-testid='apply-coupon-button']"),
targetPage.locator('::-p-xpath(//[@data-testid=\"apply-coupon-button\"])'),
targetPage.locator(":scope >>> [data-testid='apply-coupon-button']"),
targetPage.locator('::-p-text(Apply)')
])
.setTimeout(timeout)
.click({
offset: {
x: 47.912506103515625,
y: 4.0558319091796875,
},
});
}
{
const targetPage = page;
await targetPage.waitForFunction(document.querySelector('[data-testid="cart-total"]')?.textContent?.trim() === '₹3,240', { timeout });
}
await browser.close();

8967b18b-4635-4ecf-9c31-b5d34488478a.png

e1b0b34d-31dc-48d2-b7e8-915f8c43812e.png

0325741f-bd4a-42ad-a60b-a8df6b7fa323.png
installtion done, and i ran that script, what to expect now,

5cafc7dc-9e23-4860-9f1e-5e7106bb115c.png
so i made that change so browser open but nothing ran, and i got this error,

Pasted markdown(1).md
File
so i was recording and got to understand terhe lots of code in between after we expor the pupeeter, then there aer lot of things feel unneccesary or discussonneted, doesnt sounds like a develoer is talking and giving a overview to other developers

## Can this be done with Vitest, Playwright, or Cypress?

Yes.

Vitest Browser Mode, Playwright, Cypress, and other testing tools can also automate browser flows.

But that’s not really the point of this video.

### Where Recorder fits

If you're already debugging something in Chrome and repeatedly doing the same steps:

**Manual bug flow → Record once → Replay**

Recorder gives you a very quick way to make that flow repeatable without first setting up a proper test.

### Is Recorder better than Playwright/Vitest?

Not necessarily.

For a proper automated test suite, tools like Playwright, Vitest, or Cypress may be a better fit depending on the project.

Recorder is useful as a quick bridge:

**Manual reproduction → Repeatable flow → Optional regression coverage later**

So the claim is not:

> Recorder replaces your testing framework.

It's:

> If you're already reproducing the same bug again and again in Chrome, Recorder can save you that repetitive work.

Pasted markdown(2).md
File
i mean i need thsi scrip tin md format

Yes — here’s the script as an .md file, based on the latest version you shared.

Download the final Chrome DevTools Recorder script

chrome-devtools-recorder-final-script.md
Document

hope nothing is removed?

chrome-devtools-recorder-final-script.md

Final Recording Script — Chrome DevTools Recorder
Opening

[Screen: browser on the app. Show a few quick cuts of the reproduction flow.]

Bug fix karna kabhi-kabhi easy hota hai.

Irritating part hota hai bug tak baar-baar pahunchna.

Ek code change kiya...

phir browser mein wapas jao.

Search karo...

product open karo...

cart mein add karo...

coupon apply karo...

quantity change karo...

tab jaake woh bug wali state milti hai.

Fix nahi hua?

Same poora flow dobara.

[Stop moving the mouse. Show the buggy cart state.]

Agar bug 5–6 steps ke baad reproduce hota hai, debugging ke time ye repetition kaafi annoying ho jati hai.

[Open DevTools.]

Chrome DevTools mein ek Recorder hai jahan ye flow ek baar record karke baad mein replay karwa sakte ho.

[Open Recorder.]

Chalo isi cart calculation bug pe try karke dekhte hain.

Record the flow

New recording start karta hoon...

aur wahi complete flow once perform karta hoon.

[Start recording.]

watch search kiya.

Sport Chronograph Watch open ki.

Cart mein add kiya.

Coupon SAVE10PERCENT apply kiya.

Aur quantity increase.

[Stop recording.]

Recording stop.

Ab yahan Chrome ne koi screen recording save nahi ki hai.

Jo actions maine perform kiye, woh individual steps ke form mein capture hue hain.

[Expand the search step.]

For example ye search step dekho.

Input value capture hui hai...

click capture hua hai...

aur element identify karne ke liye Recorder multiple selectors bhi save kar raha hai.

ARIA selector hai...

data-testid hai...

XPath bhi hai.

Ye selectors maine manually nahi likhe.

Recorder ne interaction record karte time khud capture kiye hain.

Replay

Ab maan lo code mein ek change kiya.

Normally mujhe same bug reproduce karne ke liye ye poora flow manually repeat karna padta.

Instead...

[Reset page. Move hands away from the mouse.]

Replay.

[Let Recorder execute the whole flow.]

Search...

product open...

cart...

coupon...

quantity.

Sab automatically repeat ho gaya.

Aur debugging ke time mere liye Recorder ka simplest use yahi hai:

same reproduction flow har code change ke baad manually repeat nahi karna.

Slow replay

Normal replay kaafi fast hai.

Agar mujhe actually observe karna hai ki kis step pe kya change ho raha hai...

kaafi kuch miss ho sakta hai.

[Replay dropdown → Slow.]

Isko Slow pe replay kar sakte hain.

[Run it.]

Ab actions ke beech thoda gap hai, so flow follow karna easier hai.

Ek small distinction:

ye network slow nahi kar raha.

API intentionally slow nahi ho rahi.

Bas recorded interactions ka replay pace slow ho raha hai.

Pause exactly where I need to debug

Mere case mein doubt quantity change ke around hai.

Toh directly us step se pehle breakpoint laga deta hoon.

[Breakpoint before Increase Quantity.]

Replay.

[Flow pauses.]

Ab flow exactly yahan ruk gaya.

Aur page locked nahi hua hai.

Main current UI inspect kar sakta hoon...

Network check kar sakta hoon...

Console open kar sakta hoon...

even page pe manually state change karke kuch verify karna ho, woh bhi kar sakta hoon.

Aur jab ready hoon...

[Execute one step.]

sirf next recorded step run.

Ab mujhe poora flow dobara run karke wait nahi karna.

Main directly us point pe ruk sakta hoon jahan mujhe doubt hai.

Recording ke time mistake ho gayi toh?

Flow check karte time mujhe ek aur cheez notice hui.

Recording ke time quantity pe extra click ho gaya tha.

[Show duplicate Increase Quantity step.]

Iske liye poori recording dobara banane ki zarurat nahi.

Step menu...

Remove step.

Done.

[Remove it.]

Values bhi edit kar sakte ho.

For example search value yahin se change kar sakta hoon.

Bas ek thing yaad rakhna:

agar next steps us value pe depend karte hain...

woh automatically rewrite nahi honge.

Aur right side ka generated JSON/code read-only hai.

Actual changes left side ke Recorder steps mein karne hain.

So recording editable hai...

but flow mein dependencies kya hain, woh still hume samajhni padegi.

Replay enough nahi — expected result bhi verify karna hai

Ab reproduction flow clean hai.

But ek problem abhi bhi hai.

Recorder quantity increase toh kar dega...

but mujhe automatically kaise pata chalega ki calculation actually correct hui ya nahi?

Coupon apply hone ke baad quantity 1 hai.

Expected total:

₹3,240.

[Add waitForExpression.]

Main ek waitForExpression add karta hoon:

document.querySelector('[data-testid="cart-total"]')
?.textContent?.trim() === '₹3,240'

Basically jab tak cart total ₹3,240 nahi hota...

wait karo.

[Replay.]

Pass.

Good.

Yahan tak calculation correct hai.

Problem quantity change ke baad hai.

[Increase quantity.]

Quantity 2.

Expected total:

₹6,480.

Ek aur expression:

document.querySelector('[data-testid="cart-total"]')
?.textContent?.trim() === '₹6,480'

Replay.

[Show failure.]

And this one fails.

Because UI actually ₹6,840 show kar rahi hai.

Ab flow sirf bug tak pahunch nahi raha...

ye check bhi kar raha hai ki expected result mila ya nahi.

Recorder iske peeche generate kya kar raha hai?

Ab ek cheez mujhe interesting lagi.

Ye steps Recorder ke andar actually represent kaise ho rahe hain?

[Open Show Code → Puppeteer.]

Ye dekho.

Left side pe recorded steps...

right side pe generated code.

Jo ₹3,240 wali verification humne add ki thi...

wahi yahan:

await targetPage.waitForFunction(
document.querySelector('[data-testid="cart-total"]')?.textContent?.trim() === '₹3,240',
{ timeout }
);

ban gayi.

Clicks ka code hai...

inputs ka hai...

navigation ka hai...

verification ka bhi hai.

So jo browser journey humne manually record ki thi...

Recorder uska actual automation code bhi generate kar raha hai.

Puppeteer — only the context we need

Yahan Puppeteer naam aa raha hai.

Agar Puppeteer use nahi kiya hai...

simple words mein:

JavaScript se browser automate karne ki library hai.

Code se page open...

click...

type...

navigate...

values check.

Bas itna context abhi enough hai.

Recorder ke andar replay toh already ho raha hai...

but agar mujhe isi flow ko DevTools ke bahar run karna ho?

Export the same flow

[Export → Puppeteer.]

Isko Puppeteer format mein export karta hoon.

File project mein save.

Mera project pnpm use karta hai, so Puppeteer install:

pnpm add -D puppeteer

And generated file run:

node scripts/recorder/cart-discount-bug.mjs

[Run it.]

Command run hui...

but browser visible nahi hai.

At first laga run hua bhi ya nahi.

Generated code dekho:

const browser = await launch();

Puppeteer by default headless run kar raha hai.

Matlab automation background mein ho rahi hai...

visible browser window nahi khul rahi.

Automation ke liye that's fine.

But abhi mujhe actually flow dekhna hai.

So generated file mein couple of small adjustments karta hoon.

const browser = await launch({
headless: false,
slowMo: 50,
});

const timeout = 15000;

headless: false — browser visible.

slowMo: 50 — thoda delay so flow clearly dekh sakein.

Aur dry run mein 5-second timeout mere flow ke liye thoda tight tha...

so maine 15 seconds kar diya.

Ye Recorder use karne ke liye mandatory configuration nahi hai.

Generated JavaScript ko bas apne flow ke according adjust kar raha hoon.

Run again.

[Browser opens and runs the flow.]

And now...

wahi journey jo Recorder ke andar run ho rahi thi...

project se run ho rahi hai.

Failure outside Recorder

Application bug abhi present hai.

So final ₹6,480 verification obviously pass nahi hogi.

[Let it fail. Show terminal.]

And terminal mein raw error milta hai:

TimeoutError: Waiting failed: 15000ms exceeded

Fail hona correct hai...

but raw timeout dekhke immediately ye clear nahi hai ki expected value kya thi.

Since exported file ab normal JavaScript hai...

final check ko thoda readable bana deta hoon.

[Show only this small modification.]

try {
await targetPage.waitForFunction(
document.querySelector('[data-testid="cart-total"]')?.textContent?.trim() === '₹6,480',
{ timeout }
);

console.log('✅ Cart total is correct: ₹6,480');
} catch {
console.error('❌ Cart total is wrong. Expected ₹6,480');
}

Run again.

Now directly:

❌ Cart total is wrong. Expected ₹6,480

Much clearer.

Bas.

Main isko Puppeteer tutorial nahi banana chahta.

Point sirf itna hai:

export ke baad ye normal JavaScript hai.

Needed ho toh error handling...

screenshots...

different assertions...

existing testing setup...

ye sab customise kiya ja sakta hai.

Now fix the actual bug

Ab automation ne issue reproduce bhi kar diya...

aur expected result verify bhi kar diya.

Actual application bug fix kar deta hoon.

[Quick VS Code glimpse / cut. Do NOT explain the application code.]

Fix done.

Ab dekhte hain same flow kya bolta hai.

Same recording after the fix

Recorder mein wahi same flow hai.

Koi expected value change nahi ki.

Koi verification change nahi ki.

Replay.

[Run.]

Coupon ke baad:

₹3,240.

Pass.

Quantity increase.

₹6,480.

Pass.

Same flow jo fix se pehle fail ho raha tha...

ab pass ho raha hai.

Aur same exported Puppeteer flow project se bhi run karta hoon.

node scripts/recorder/cart-discount-bug.mjs

[Run visibly.]

Pass.

Ye part mujhe actually kaafi useful laga.

Bug reproduce karne ke liye jo exact journey record ki thi, fix ke baad wahi journey regression check ke kaam aa sakti hai.

Then Puppeteer export ki zarurat kab hai?

Ab ek genuine question banta hai.

Recorder ke andar Replay already hai.

Toh Puppeteer export kyun?

And answer hai:

har case mein zarurat nahi hai.

Agar main actively debug kar raha hoon...

aur bas same flow repeat karna hai...

Recorder Replay enough hai.

But agar isi journey ko project mein save karna hai...

team ke kisi aur developer ko run karna hai...

ya later existing test setup ya CI mein wire karna hai...

tab export useful ho sakta hai.

But ek important boundary.

Recorder automatically production-ready E2E test suite nahi bana raha.

Real project mein still hume decide karna padega:

test data...

starting state...

authentication...

stable selectors...

cleanup...

aur overall test architecture.

So main isse E2E framework ka replacement nahi bolunga.

Mere liye useful bridge ye hai:

manual reproduction → repeatable browser flow.

Aur kabhi-kabhi QA ya production mein mila bug hi bata deta hai ki regression coverage mein kaunsa user journey missing tha.

Performance — just a glimpse

[Back to Recorder.]

Aur ek last thing.

Recorder mein Measure performance bhi hai.

[Click it.]

Isi recorded flow ka performance trace bhi generate kar sakte ho.

[Performance panel opens. Hold only 2–3 seconds.]

Isko properly read kaise karna hai...

woh next video mein dekhenge.

Closing

So next time debugging ke time same 5–6 steps baar-baar repeat kar rahe ho...

Recorder try karna.

Flow once record karo...

jahan doubt hai wahan pause karo...

expected result verify karo...

aur agar wahi journey future mein useful hai...

usse project tak le ja sakte ho.

Aise practical debugging workflows useful lagte hain...

subscribe kar lena.

Next video mein Performance side explore karte hain.

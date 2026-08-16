## Opening: Show the bug

**[Screen: Search `shoes`. Before the request completes, replace it with `buds`. Buds appear first, then shoes replace them.]**

Search box mein `buds` likha hai…

but results `shoes` ke dikh rahe hain.

Aur interesting part ye hai ki dono API responses correct hain.

Toh phir UI wrong kaise ho gayi?

Let’s debug it.

---

## Reproduce the issue

Imagine QA ne bug report kiya:

“Search kabhi-kabhi wrong products show karti hai.”

Problem ye hai ki normally test karne par sab properly work karta hai.

**[Search `shoes` and wait.]**

`shoes` search kiya—correct result.

**[Search `buds` and wait.]**

`buds` search kiya—ye bhi correct.

Bug tab reproduce hota hai jab user search quickly change karta hai.

**[Search `shoes`, then quickly replace it with `buds`.]**

Pehle `shoes` request start hui.

Uske complete hone se pehle maine `buds` search kar diya.

Buds ke results aaye…

but kuch seconds baad shoes ne unhe replace kar diya.

Ab bug consistently reproduce ho raha hai.

---

## Check the Network tab

First assumption ho sakta hai ki backend wrong data bhej raha hai.

Network tab check karte hain.

Yahan do requests hain:

Ek `shoes` ke liye…

aur ek `buds` ke liye.

**[Open the buds response.]**

`buds` request ne correct products return kiye hain.

**[Open the shoes response.]**

Aur `shoes` response bhi correct hai.

Matlab response data mein koi issue nahi hai.

Ab inka timing check karte hain.

`shoes` request pehle start hui thi…

but usse complete hone mein zyada time laga.

`buds` request baad mein start hui…

lekin woh pehle complete ho gayi.

Aur yahi actual clue hai.

---

## Understand the sequence

Sequence kuch aisa hua:

`shoes` request start hui.

Uske baad `buds` request start hui.

`buds` response pehle aaya…

toh UI mein buds show ho gaye.

Lekin older `shoes` request abhi bhi running thi.

Jaise hi woh complete hui…

usne products state dobara update kar di.

Aur buds ki jagah shoes show ho gaye.

Response data correct tha.

Problem response ke completion order mein thi.

This is a race condition.

---

## Find the problem in code

Ab code dekhte hain.

Query change hone ke baad API request call ho rahi hai.

Aur har completed response directly:

`setProducts(response.products)`

call kar raha hai.

Code ye check nahi karta ki response current search ka hai…

ya kisi previous search ka.

Jo request last mein complete hogi…

wahi UI update kar degi.

Even when it belongs to an older query.

---

## Decide the expected behaviour

Code change karne se pehle decide karte hain ki expected behaviour kya hona chahiye.

Jab user new search karta hai…

previous search request ki ab zarurat nahi hai.

So ideally:

New search start ho.

Previous request cancel ho jaye.

Aur sirf active request loading aur products state update kare.

Iske liye hum `AbortController` use karenge.

---

## Add the request controller

Sabse pehle component mein active request ko store karne ke liye ek ref add karenge.

**[Add `useRef` to the React import.]**

```ts
import { useEffect, useMemo, useRef, useState } from "react";
```

Aur component ke andar:

```ts
const activeRequestController = useRef<AbortController | null>(null);
```

Is ref mein currently running request ka controller store hoga.

---

## Cancel the previous request

Ab jab bhi new search start hogi…

pehle previous request abort karenge.

```ts
activeRequestController.current?.abort();
```

Uske baad new request ke liye controller create karenge.

```ts
const requestController = new AbortController();

activeRequestController.current = requestController;
```

Aur controller ka signal API request ko pass karenge.

```ts
searchProducts(trimmedQuery, {
  signal: requestController.signal,
});
```

Ab new search start hote hi old request cancel ho jayegi.

---

## Handle the aborted request

Request abort hone par fetch ek `AbortError` throw karega.

But ye actual API failure nahi hai.

Humne intentionally outdated request cancel ki hai.

So catch block mein `AbortError` ko ignore karenge.

```ts
.catch((error) => {
  if (isAbortError(error)) {
    return;
  }

  setProducts([]);
})
```

Isse cancelled request user ko unnecessary error state nahi dikhayegi.

---

## Protect the loading state

Ek aur important detail hai.

Old request ka `finally` block new request ki loading state ko false nahi karna chahiye.

Isliye loading tabhi stop karenge jab complete hui request abhi bhi active request ho.

```ts
.finally(() => {
  if (
    activeRequestController.current ===
    requestController
  ) {
    activeRequestController.current = null;
    setIsLoading(false);
  }
});
```

Ab outdated request products ya loading state ko affect nahi karegi.

Component unmount hone par active request ko cancel karna bhi better hai.

```ts
useEffect(() => {
  return () => {
    activeRequestController.current?.abort();
  };
}, []);
```

---

## Verify the fix

Ab same flow dobara test karte hain.

**[Open the fixed app.]**

Pehle `shoes`.

Aur request complete hone se pehle `buds`.

Is baar previous shoes request cancel ho gayi.

Latest buds request complete hui…

aur UI par buds ke results hi remain kar rahe hain.

**[Show Network tab.]**

Network tab mein old request cancelled dikh rahi hai.

Aur latest request successfully complete hui hai.

---

## Final takeaway

Is bug mein backend correct data bhej raha tha.

React state bhi update ho rahi thi.

Problem ye thi ki older response baad mein aakar latest results overwrite kar raha tha.

Isliye search, autocomplete ya filters mein inconsistent results dikhein…

sirf response data mat check karo.

Request start order, completion order aur state update sequence bhi check karo.

Because the latest request does not always finish last.

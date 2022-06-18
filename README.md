# Gra dogtrekkingowa
<p>Aplikacja webowa do gry dogtrekkingowej napisana dla Studenckiego Koła Naukowego Sympatyków Zwierząt UPH.</p>
<br />
<p>Aby aplikacja uruchomiła się poprawnie, należy uzupełnić initializeApp (apiKey, authDomain itd.) w src/utils/firebase.tsx oraz apiKey w src/utils/imgur.tsx. Dodatkowo należy uzupełnić wszystkie brakujące node moduły, o które będzie domagać się npm podczas uruchamiania.</p>

<hr />

<h1>Wykorzystane technologie</h1>
<ul>
  <li>Ionic React</li>
  <li>Firebase</li>
  <li>Baza danych NoSQL Firestore</li>
  <li>Imgur API</li>
</ul>

<hr />

<h1>Funkcjonalność</h1>
<ul>
  <li>Ciemny lub jasny motyw w zależności od ustawień przeglądarki (prefers-color-scheme)</li>
  <li>Autoryzacja przez konto Google lub anonimowa</li>
  <li>Zmiana imienia i nazwiska</li>
  <li>Zadania podzielone na dwa etapy: zagadka odnośnie miejsca, w którym znajduje się kod, oraz polecenie wymagające potwierdzenia zdjęciem</li>
  <li>Prosty panel administracyjny pokazujący listę graczy zawierającą informacje m.in. o aktualnym zadaniu i ilości punktów</li>
  <li>Szczegóły gracza zawierające zdjęcia i możliwość ich zatwierdzenia lub odrzucenia</li>
  <li>Upload zdjęć na serwery Imgur'a, których linki i delete hashe są przechowywane w bazie danych</li>
</ul>

<hr />

<h1>Zrzuty ekranu</h1>
<p>---------- Autoryzacja ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174433886-f6719733-1140-42bb-8f07-932cdee1efac.png" />
<p>---------- Potwierdzenie imienia i nazwiska ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174433896-03a33e6f-cdae-4053-9b29-f7775fd4685a.png" />
<p>---------- Zmiana imienia i nazwiska ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174433911-7a300575-5144-4700-945b-2f26ca24fdc4.png" />
<p>---------- Zadanie: zagadka ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174433936-5924c913-5520-47f6-a606-3b63d6adfc4e.png" />
<p>---------- Zadanie: polecenie ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174433981-533a5bec-e3e3-47ba-a9d0-de46af006346.png" />
<p>---------- Zakończenie gry ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174434450-e9166c22-47f4-461c-a6d2-4922e1cc60b8.png" />
<p>---------- Administrator: lista graczy ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174434097-00a54cdc-f1e8-4269-9e1e-2224f9923be3.png" />
<p>---------- Administrator: szczegóły gracza (zdjęcia przesuwa się przeciąganiem na boki) ----------</p>
<img src="https://user-images.githubusercontent.com/107581764/174434160-d0932629-d772-40e8-a744-906583b2f665.png" />

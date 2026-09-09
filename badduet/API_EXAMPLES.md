# Примеры API для интеграции с БАДдуэт

## 1. Внешние API для получения данных о веществах

### 1.1 PubMed API (научные публикации)
```javascript
// Поиск статей о взаимодействии веществ
const searchPubMed = async (query) => {
  const response = await fetch(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&api_key=YOUR_API_KEY`
  );
  return response.json();
};

// Получение деталей статьи
const getArticleDetails = async (pmid) => {
  const response = await fetch(
    `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json&api_key=YOUR_API_KEY`
  );
  return response.json();
};
```

### 1.2 OpenFDA API (лекарственные препараты США)
```javascript
// Поиск информации о препарате
const searchDrug = async (substanceName) => {
  const response = await fetch(
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(substanceName)}"&limit=5`
  );
  return response.json();
};

// Получение предупреждений о взаимодействиях
const getDrugInteractions = async (substanceName) => {
  const response = await fetch(
    `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(substanceName)}"+AND+interactions:&limit=10`
  );
  return response.json();
};
```

### 1.3 DrugBank API (платный, но полный)
```javascript
// Поиск вещества в DrugBank
const searchDrugBank = async (query) => {
  const response = await fetch(
    `https://go.drugbank.com/api/v1/search.json?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'Authorization': 'Token YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
};

// Получение взаимодействий
const getInteractions = async (drugId) => {
  const response = await fetch(
    `https://go.drugbank.com/api/v1/drugs/${drugId}/drug_interactions.json`,
    {
      headers: {
        'Authorization': 'Token YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
};
```

### 1.4 Semantic Scholar API (бесплатный аналог PubMed)
```javascript
// Поиск научных статей
const searchSemanticScholar = async (query) => {
  const response = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&fields=title,authors,abstract,citationCount&limit=10`
  );
  return response.json();
};
```

## 2. Российские источники данных

### 2.1 ГРЛС (Государственный реестр лекарственных средств)
```javascript
// Парсинг данных с сайта ГРЛС (требуется веб-скрейпинг)
const searchGRLS = async (substanceName) => {
  // Официального API нет, требуется парсинг
  // https://grls.rosminzdrav.ru/grls_2010.aspx
  const response = await fetch('/api/proxy/grls', {
    method: 'POST',
    body: JSON.stringify({ query: substanceName })
  });
  return response.json();
};
```

### 2.2 Клинические рекомендации Минздрава РФ
```javascript
// Поиск клинических рекомендаций
const searchClinicalGuidelines = async (disease) => {
  const response = await fetch(
    `https://cr.minzdrav.gov.ru/api/recommendations?search=${encodeURIComponent(disease)}`
  );
  return response.json();
};
```

## 3. AI/LLM API для обработки данных

### 3.1 YandexGPT (российский, соответствует требованиям гранта)
```javascript
const callYandexGPT = async (prompt, context) => {
  const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.YANDEX_API_KEY}`
    },
    body: JSON.stringify({
      modelUri: 'gpt://b1g.../yandexgpt/latest',
      completionOptions: {
        stream: false,
        temperature: 0.3,
        maxTokens: 2000
      },
      messages: [
        { role: 'system', text: 'Вы — фармаколог-эксперт. Анализируйте взаимодействия лекарств.' },
        { role: 'user', text: prompt }
      ]
    })
  });
  return response.json();
};
```

### 3.2 GigaChat (Сбер, российский)
```javascript
const callGigaChat = async (prompt) => {
  const response = await fetch('https://gigachat.developer.sber.ru/api/v2/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GIGACHAT_API_KEY}`
    },
    body: JSON.stringify({
      model: 'GigaChat',
      messages: [
        { role: 'system', content: 'Вы помогаете анализировать совместимость БАД и лекарств.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  return response.json();
};
```

### 3.3 ruGPT-3 (Сбер, open-source, можно развернуть локально)
```javascript
// Локальное развертывание через Transformers
const callLocalRuDialoGPT = async (prompt) => {
  // Требуется установка: pip install transformers torch
  // Запуск через Python backend
  const response = await fetch('http://localhost:5000/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: prompt,
      max_length: 500,
      temperature: 0.3
    })
  });
  return response.json();
};
```

## 4. API для распознавания штрих-кодов

### 4.1 Google Vision API
```javascript
const scanBarcode = async (imageBase64) => {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: imageBase64 },
          features: [{ type: 'TEXT_DETECTION', maxResults: 10 }]
        }]
      })
    }
  );
  return response.json();
};
```

### 4.2 Tesseract.js (бесплатный, клиентский)
```javascript
import Tesseract from 'tesseract.js';

const scanBarcodeClient = async (imageFile) => {
  const result = await Tesseract.recognize(imageFile, 'rus', {
    logger: m => console.log(m)
  });
  return result.data.text;
};
```

## 5. Структура backend API для БАДдуэт

### 5.1 Endpoints

```yaml
# Вещества
GET    /api/substances/search?q=query     # Поиск по названию
GET    /api/substances/:id                # Получить вещество по ID
GET    /api/substances/popular            # Популярные вещества
POST   /api/substances                    # Добавить вещество (admin)
PUT    /api/substances/:id                # Обновить вещество (admin)
DELETE /api/substances/:id                # Удалить вещество (admin)

# Проверки совместимости
POST   /api/compatibility/check           # Проверить совместимость
GET    /api/compatibility/history         # История проверок пользователя
GET    /api/compatibility/:id             # Получить результат проверки

# AI-чат
POST   /api/chat/message                  # Отправить сообщение в чат
GET    /api/chat/limits                   # Проверить лимиты вопросов

# Сканирование
POST   /api/barcode/scan                  # Распознать штрих-код

# Реклама
GET    /api/ads/banners                   # Получить баннеры
GET    /api/ads/bad-month                 # БАДы месяца
POST   /api/ads/click                     # Клик по баннеру

# Пользователи
POST   /api/auth/register                 # Регистрация
POST   /api/auth/login                    # Вход
POST   /api/auth/logout                   # Выход
GET    /api/auth/profile                  # Профиль пользователя
PUT    /api/auth/profile                  # Обновить профиль
```

### 5.2 Модель данных

```javascript
// Substance (Вещество)
{
  _id: ObjectId,
  name: String,              // Торговое название
  mnn: String,               // МНН (активное вещество)
  synonyms: [String],        // Синонимы
  type: String,              // 'drug' | 'supplement'
  category: String,          // Категория
  instructions: {            // Инструкция по приему
    dosage: String,
    frequency: String,
    timing: String,          // 'morning' | 'evening' | 'with_food'
    foodRelation: String     // 'before' | 'after' | 'during'
  },
  createdAt: Date,
  updatedAt: Date
}

// Interaction (Взаимодействие)
{
  _id: ObjectId,
  substance1_id: ObjectId,   // Ссылка на первое вещество
  substance2_id: ObjectId,   // Ссылка на второе вещество
  status: String,            // 'safe' | 'warning' | 'danger'
  description_patient: String,
  description_doctor: String,
  mechanism: String,         // Механизм взаимодействия
  sources: [{               // Источники
    type: String,            // 'pubmed' | 'grls' | 'guideline'
    url: String,
    title: String,
    date: Date
  }],
  verified: Boolean,         // Проверено экспертом
  verifiedBy: ObjectId,      // Кто проверил
  createdAt: Date,
  updatedAt: Date
}

// User (Пользователь)
{
  _id: ObjectId,
  email: String,
  phone: String,
  passwordHash: String,
  role: String,              // 'patient' | 'doctor'
  checksCount: Number,       // Количество проверок
  subscription: {
    type: String,            // 'free' | 'premium'
    expiresAt: Date
  },
  chatLimits: {
    dailyLimit: Number,
    usedToday: Number,
    resetAt: Date
  },
  createdAt: Date,
  lastLogin: Date
}

// CheckHistory (История проверок)
{
  _id: ObjectId,
  userId: ObjectId,
  substances: [ObjectId],
  results: [{
    pair: [ObjectId, ObjectId],
    status: String,
    description: String
  }],
  createdAt: Date
}
```

## 6. Рекомендуемый стек технологий

### Backend (Россия, соответствие требованиям):
- **Язык:** Python 3.11+ или Node.js 20+
- **Фреймворк:** FastAPI (Python) или Express.js (Node.js)
- **База данных:** PostgreSQL 15+
- **Кэш:** Redis 7+
- **Поиск:** Elasticsearch 8+ (для быстрого поиска веществ)
- **Хостинг:** Yandex Cloud, SberCloud, Selectel

### AI/ML:
- **LLM:** YandexGPT, GigaChat, или ruGPT-3 (локально)
- **OCR:** Tesseract.js (клиент) или Яндекс Vision API
- **Векторная БД:** Qdrant (российская разработка) для семантического поиска

### Frontend:
- **Фреймворк:** React 18+ (Vite)
- **UI:** Material UI или Ant Design
- **State:** Zustand или Redux Toolkit
- **HTTP:** Axios или TanStack Query

## 7. Пример реализации backend (FastAPI)

```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import httpx

app = FastAPI(title="БАДдуэт API")

class SubstanceSearch(BaseModel):
    query: str

class CompatibilityCheck(BaseModel):
    substance_ids: List[str]

class ChatMessage(BaseModel):
    message: str
    context: dict

@app.post("/api/substances/search")
async def search_substances(search: SubstanceSearch):
    # Поиск в базе данных + внешние API
    async with httpx.AsyncClient() as client:
        # Параллельный запрос к PubMed и Semantic Scholar
        tasks = [
            client.get(f"https://eutils.ncbi.nlm.nih.gov/...?term={search.query}"),
            client.get(f"https://api.semanticscholar.org/...?query={search.query}")
        ]
        responses = await asyncio.gather(*tasks)
    
    return {"results": process_results(responses)}

@app.post("/api/compatibility/check")
async def check_compatibility(check: CompatibilityCheck):
    # Проверка всех пар веществ
    pairs = generate_pairs(check.substance_ids)
    results = []
    
    for pair in pairs:
        interaction = await db.interactions.find_one({
            "substance1_id": pair[0],
            "substance2_id": pair[1]
        })
        
        if not interaction:
            # Если нет в базе - запрос к AI для анализа
            interaction = await ai_analyze_interaction(pair)
        
        results.append(interaction)
    
    return {"pairs": results, "check_time": "< 10s"}

@app.post("/api/chat/message")
async def chat_message(msg: ChatMessage):
    # Отправка в YandexGPT или GigaChat
    response = await call_yandex_gpt(
        prompt=msg.message,
        context=msg.context
    )
    
    return {"message": response["choices"][0]["text"]}
```

## 8. Лицензии и ограничения

| API | Стоимость | Лимиты | Требования |
|-----|-----------|--------|------------|
| PubMed | Бесплатно | 10 запросов/сек | API key |
| OpenFDA | Бесплатно | Без лимитов | Нет |
| DrugBank | $$$$ | Зависит от тарифа | Лицензия |
| YandexGPT | $$ | 1M токенов/мес | Яндекс облако |
| GigaChat | $$ | 500K токенов/мес | Сбер ID |
| Google Vision | $ | 1000 запросов/мес | Billing аккаунт |

**Рекомендация для гранта:** Использовать российские AI-сервисы (YandexGPT, GigaChat) для соответствия требованиям, хранить данные на территории РФ (Yandex Cloud, SberCloud).

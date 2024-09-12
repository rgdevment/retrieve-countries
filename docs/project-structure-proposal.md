src/
│
├── common/
│   ├── schemas/
│   │   ├── city.schema.ts
│   │   ├── state.schema.ts
│   │   ├── flag.schema.ts
│   │   ├── currency.schema.ts
│   │   ├── country.schema.ts
│   │
│   ├── dto/
│   │   ├── create-country.dto.ts
│   │   ├── update-country.dto.ts
│   │
│   ├── interfaces/
│   │   ├── country.interface.ts
│   │   ├── city.interface.ts
│   │   ├── state.interface.ts
│   │
│   └── common.module.ts
│
├── modules/
│   ├── countries/
│   │   ├── countries.module.ts
│   │   ├── countries.controller.ts
│   │   ├── countries.service.ts
│   │
│   ├── cities/
│   │   ├── cities.module.ts
│   │   ├── cities.controller.ts
│   │   ├── cities.service.ts
│   │
│   └── states/
│       ├── states.module.ts
│       ├── states.controller.ts
│       ├── states.service.ts
│
└── app.module.ts

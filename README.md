# TEMS DAS Backend in ExpressJS
---

[![forthebadge](https://forthebadge.com/images/badges/fuck-it-ship-it.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/gluten-free.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-vue.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-python.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/made-with-c-sharp.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/certified-steve-bruhle.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/60-percent-of-the-time-works-every-time.svg)](https://forthebadge.com)

### Components
-  Routing and Server: [Express](https://expressjs.com/)
-  Frontend Framework: [Vue](https://vuejs.org/) (Not yet implemented)
-  Object Relational Mapping: [Sequelize](https://github.com/sequelize/sequelize)
-  API Queries: [GraphQL](https://graphql.org/)
-  Database: [PostgreSQL](https://www.postgresql.org/)

### Installation.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Requires Nodejs, npm to be installed.
```
npm install
npm run start
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Requires PostgreSQL server to be installed.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Change Postgres settings in `./models/index.js`
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This will be in the `TEMS_DB` environment variable during production

---

<h2>Sample Graphql Query</h2>

<details><summary>Expand</summary>
<p>
  
```
{
  getTesterByName(name:"GRONK2") {
    id
    Slots{
      slotNumber
      Boards {
        boardId
      }
      Monitors {
        name
      }
      
    }
    Warnings {
      message
    }
    Faults {
      date
    }
  }
}
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Will return 

```
{
  "data": {
    "getTesterByName": {
      "id": 1,
      "Slots": [
        {
          "slotNumber": 1,
          "Boards": [
            {
              "boardId": "0000-0000-0000"
            }
          ],
          "Monitors": [
            {
              "name": "Heat"
            }
          ]
        }
      ],
      "Warnings": [
        {
          "message": "Error!"
        }
      ],
      "Faults": [
        {
          "date": "Wed Jul 11 2018 01:44:41 GMT-0400 (Eastern Daylight Time)"
        }
      ]
    }
  }
}
```
</p>
</details>

# EyeSee - Reports API TODO

## TODO
- [ ] Schema Change:
    - [ ] Update reports to include hourly dwell time'
    - [ ] Update the queries accordingly
- [ ] Create operations:
    - [ ] Adding from the ML service
- [ ] Read operations:
    - [ ] Aggregation: Support multiple dates
    - [ ] Support for filters (per store):
        - [ ] Filter by age
- [ ] Delete:
    - [ ] Delete entire report
- [ ] Update: the ability to edit the hourly reports (optional)
- [ ] Tests:
    - [ ] Delete:
        - [ ] Delete entire report (server side)
        - [ ] Delete entire report

## In Progress
- [ ] Schema Change:
    - [ ] Update the queries accordingly
- [ ] Tests:
    - [ ] Read:
        - [ ] Default qurey (client side) - by Yonatan
        - [ ] Filter by date (client side) - by Yonatan
        - [ ] Filter by range (client side) - by Yonatan
        - [ ] Filter by gender (client side) - by Yonatan


## Completed
- [x] Read operations:
    - [x] Default query of main store.
    - [x] Support for filters (per store):
        - [x] Filter by date
        - [x] Filter by dates (range)
        - [x] Filter by gender
- [ ] Schema Change:
    - [x] Update reports to include hourly dwell time
- [x] Generate fake data:
    - [x] Bug fix: the reports of each store does not have an id and ref
    - [x] Add dwell time
- [x] Tests:
    - [x] Read:
        - [x] Defualt qurey (server side)
        - [x] Filter by date (server side)
        - [x] Filter by dates (range) (server side)
        - [x] Filter by gender (server side)

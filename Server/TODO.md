# EyeSee - Reports API TODO

## TODO
- [ ] Create operations:
    - [ ] Adding from the ML service
- [ ] Read operations:
    - [ ] Aggregation: Support multiple dates
- [ ] Delete:
    - [ ] Delete entire report
- [ ] Update: the ability to edit the hourly reports (optional)
- [ ] Tests:
    - [ ] Delete:
        - [ ] Delete entire report (server side)
        - [ ] Delete entire report

## In Progress
- [ ] Read operations:
    - [ ] Support for filters (per store):
        - [ ] Filter by age
- [ ] Tests:
    - [ ] Read:
        - [ ] Default qurey (client side)
        - [ ] Filter by date (client side)
        - [ ] Filter by range (client side)
        - [ ] Filter by gender (client side)


## Completed
- [x] Read operations:
    - [x] Default query of main store.
    - [x] Support for filters (per store):
        - [x] Filter by date
        - [x] Filter by dates (range)
        - [x] Filter by gender
- [x] Tests:
    - [x] Read:
        - [x] Defualt qurey (server side)
        - [x] Filter by date (server side)
        - [x] Filter by dates (range) (server side)
        - [x] Filter by gender (server side)
# EyeSee - Reports API TODO

## TODO
- [ ] Create operations:
    - [ ] Adding from the ML service
- [ ] Read operations:
    - [ ] Aggregation: Support multiple dates
- [ ] Delete:
    - [ ] Optional: delete a part of the report
- [ ] Update: the ability to edit the hourly reports (optional)
- [ ] Tests:
    - [ ] Read:
        - [ ] Default qurey (client side)
        - [ ] Filter by date (client side)
        - [ ] Filter by range (client side)
        - [ ] Filter by gender (client side)
    - [ ] Delete:
        - [ ] Delete entire report

## In Progress
- [ ] Delete:
    - [ ] Delete entire report
- [ ] Read operations:
    - [ ] Support for filters (per store):
        - [ ] Filter by age


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
        = [x] Filter by gender (server side)
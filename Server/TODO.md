# EyeSee - Reports API TODO

## TODO
- [ ] Create operations:
    - [ ] Adding manually from .csv files (or similiar format)
    - [ ] Adding from the ML service
- [ ] Read operations:
    - [ ] Support for filters (per store):
        - [ ] Filter by age
        - [ ] Filter by dates (range)
        - [ ] Filter by gender
    - [ ] Aggregation: Support multiple dates
- [ ] Delete:
    - [ ] Optional: delete a part of the report
- [ ] Update: the ability to edit the hourly reports (optional)
- [ ] Tests:
    - [ ] Read:
        - [ ] Default qurey (client side)
        - [ ] Filter by date (client side)
        - [ ] Filter by dates (range) (server side)
        - [ ] Filter by dates (range) (client side)
    - [ ] Delete:
        - [ ] Delete entire report

## In Progress
- [ ] Delete:
    - [ ] Delete entire report
- [ ] Tests:
    - [ ] Read:
        - [ ] Filter by dates (range) (server side)


## Completed
- [x] Read operations:
    - [x] Default query of main store.
    - [x] Support for filters (per store):
        - [x] Filter by date
        - [x] Filter by dates (range)
- [x] Tests:
    - [x] Read:
        - [x] Defualt qurey (server side)
        - [x] Filter by date (server side by Idan)
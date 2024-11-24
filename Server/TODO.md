# EyeSee - Reports API TODO

## TODO

## In Progress
- [ ] Tests:
    - [ ] Read:
        - [ ] Default qurey (client side) - by Yonatan
        - [ ] Filter by date (client side) - by Yonatan
        - [ ] Filter by range (client side) - by Yonatan
        - [ ] Filter by gender (client side) - by Yonatan
    - [ ] Delete:
        - [ ] Delete reports (client side) - by Yonatan
        - [ ] Delete entire report (client side) - by Yonatan
        

## Completed
- [x] Create operations:
    - [x] Adding from the ML service
- [x] Read operations:
    - [x] Default query of main store.
    - [x] Support for filters (per store):
        - [x] Filter by date
        - [x] Filter by dates (range)
        - [x] Filter by gender
        - [x] Filter by age
- [x] Schema Change:
    - [x] Update reports to include hourly dwell time
    - [x] Update the queries accordingly
- [x] Generate fake data:
    - [x] Bug fix: the reports of each store does not have an id and ref
    - [x] Add dwell time
- [x] Delete:
    - [x] Delete the entire 
    - [x] Delete reports
- [x] Tests:
    - [x] Read:
        - [x] Defualt qurey (server side)
        - [x] Filter by date (server side)
        - [x] Filter by dates (range) (server side)
        - [x] Filter by gender (server side)
    - [x] Delete:
        - [x] Delete entire report (server side)

# POS for Single Point of Sale - Server

### Notes
- In version one, there are no APIs for (expired_items, damaged_items, and perked_items) tables


### Setting stock state items as expired items
- Effected tables (item_state and stocks_state)
- Effected Fields
  - total_available_units ==> item_state
  - total_available_pcs ===> item_state
  - current_pcs ===> stocks_state
  - current_units ===> stocks_state
  - expired_units ===> stocks_state
  - expired_pcs ===> stocks_state
- set_stock_state_expire_service service is also updating total_available_units and pcs, the query can be added to item state API but we are expecting not to reuse it.

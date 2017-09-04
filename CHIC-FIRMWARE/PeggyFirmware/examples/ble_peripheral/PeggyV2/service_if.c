/* This file was generated by plugin 'Nordic Semiconductor nRF5x v.1.2.2' (BDS version 1.1.3139.0) */

#include "service_if.h"
#include <stdint.h>
#include "app_trace.h" 
#include "ble_peggy_peripheral.h"
#include "motor_control.h"
//#include "coin_events.h"

static ble_peggy_peripheral_t    m_peggy_peripheral; 



/**@brief Function for handling the Peggy peripheral events.
 *
 * @details This function will be called for all Peggy peripheral events which are passed to
 *          the application.
 *
 * @param[in]   p_peggy_peripheral   Peggy peripheral structure.
 * @param[in]   p_evt   Event received from the Peggy peripheral.
 */
static void on_peggy_peripheral_evt(ble_peggy_peripheral_t * p_peggy_peripheral, ble_peggy_peripheral_evt_t * p_evt)
{
    switch (p_evt->evt_type)
    { 
        case BLE_PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION_EVT_NOTIFICATION_ENABLED:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION evt NOTIFICATION_ENABLED. \r\n");
            break;
        case BLE_PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION_EVT_NOTIFICATION_DISABLED:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION evt NOTIFICATION_DISABLED. \r\n");
            break;
        case BLE_PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION_EVT_CCCD_WRITE:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION evt CCCD_WRITE. \r\n");
            break; 
        case BLE_PEGGY_PERIPHERAL_PENDING_TRANSACTIONS_INDICATOR_EVT_NOTIFICATION_ENABLED:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_PENDING_TRANSACTIONS_INDICATOR evt NOTIFICATION_ENABLED. \r\n");
            break;
        case BLE_PEGGY_PERIPHERAL_PENDING_TRANSACTIONS_INDICATOR_EVT_NOTIFICATION_DISABLED:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_PENDING_TRANSACTIONS_INDICATOR evt NOTIFICATION_DISABLED. \r\n");
            break;
        case BLE_PEGGY_PERIPHERAL_PENDING_TRANSACTIONS_INDICATOR_EVT_CCCD_WRITE:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_PENDING_TRANSACTIONS_INDICATOR evt CCCD_WRITE. \r\n");
            break; 
        case BLE_PEGGY_PERIPHERAL_UUID_EVT_WRITE:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_UUID evt WRITE. \r\n");
            break; 
        case BLE_PEGGY_PERIPHERAL_ERASE_BONDING_EVT_WRITE:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_ERASE_BONDING evt WRITE. \r\n");
            break; 
        case BLE_PEGGY_PERIPHERAL_USER_INFORMATION_EVT_WRITE:
            app_trace_log("[Bluetooth_IF]: PEGGY_PERIPHERAL_USER_INFORMATION evt WRITE. \r\n");
				
						ble_gatts_value_t gatts_value;
						sd_ble_gatts_value_get(p_peggy_peripheral->conn_handle, p_peggy_peripheral->user_information_handles.value_handle, &gatts_value);
						
						if(*gatts_value.p_value == 0x0001)
						{
							motor_open();
						}
						else if(*gatts_value.p_value == 0x0000)
						{
							motor_close();
						}
            break; 
        default:
            // No implementation needed.
            break;
    }
}


/**@brief Function for initializing the Services generated by Bluetooth Developer Studio.
 *
 *
 * @return      NRF_SUCCESS on successful initialization of services, otherwise an error code.
 */
uint32_t bluetooth_init(void)
{
    uint32_t    err_code; 
    ble_peggy_peripheral_init_t    peggy_peripheral_init; 
    

    // Initialize Peggy peripheral.
    memset(&peggy_peripheral_init, 0, sizeof(peggy_peripheral_init));

    peggy_peripheral_init.evt_handler = on_peggy_peripheral_evt; 
    memset(&peggy_peripheral_init.ble_peggy_peripheral_coin_event_notification_initial_value.new_coin,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_coin_event_notification_initial_value.new_coin));
    peggy_peripheral_init.is_pending_transactions_read_supported = true;
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.ones,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.ones));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.fiftys,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.fiftys));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.twenties,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.twenties));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.tens,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.tens));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.fives,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.fives));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.twos,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.twos));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.seconds,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_initial_value.seconds));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_indicator_initial_value.pending_transactions,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_pending_transactions_indicator_initial_value.pending_transactions));
    peggy_peripheral_init.is_uuid_read_supported = true;
    peggy_peripheral_init.is_uuid_write_supported = true;
    memset(&peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field1,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field1));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field2,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field2));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field3,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field3));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field4,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_uuid_initial_value.field4));
    peggy_peripheral_init.is_erase_bonding_write_supported = true;
    memset(&peggy_peripheral_init.ble_peggy_peripheral_erase_bonding_initial_value.killcode,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_erase_bonding_initial_value.killcode));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_user_information_initial_value.balance_ok,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_user_information_initial_value.balance_ok));
    memset(&peggy_peripheral_init.ble_peggy_peripheral_user_information_initial_value.user,
           0x00,
           sizeof(peggy_peripheral_init.ble_peggy_peripheral_user_information_initial_value.user));

    err_code = ble_peggy_peripheral_init(&m_peggy_peripheral, &peggy_peripheral_init);
    if (err_code != NRF_SUCCESS)
    {
        return err_code;
    } 

    return NRF_SUCCESS;
}

/**@brief Function for handling the Application's BLE Stack events.
 *
 * @details Handles all events from the BLE stack of interest to all Bluetooth Developer Studio generated Services.
 *
 * @param[in]   p_ble_evt  Event received from the BLE stack.
 */
void bluetooth_on_ble_evt(ble_evt_t * p_ble_evt)
{ 
    ble_peggy_peripheral_on_ble_evt(&m_peggy_peripheral, p_ble_evt); 
}

void notify_coin(uint8_t notification_code)
{
	if(m_peggy_peripheral.conn_handle != BLE_CONN_HANDLE_INVALID)
	{
		//BLE_PEGGY_PERIPHERAL_COIN_EVENT_NOTIFICATION_EVT_NOTIFICATION_ENABLED;
		ble_peggy_peripheral_coin_event_notification_t notify;
		notify.new_coin = notification_code;
		
		uint32_t    err_code; 
		err_code = ble_peggy_peripheral_coin_event_notification_send(&m_peggy_peripheral, &notify);
	}
	else{
		//store_coin_event(notification_code);
	}
}

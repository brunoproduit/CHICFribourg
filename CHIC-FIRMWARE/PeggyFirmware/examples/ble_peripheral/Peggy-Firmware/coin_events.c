
#include "bsp.h"
#include "coin_events.h"
#include "ble_peggy_peripheral.h"

static coin_events_t coin_events_array[255];
static uint8_t p_write;
static uint8_t p_read;
static uint32_t delta_seconds;

static uint8_t gatts_formated[10];

static bool new_event = true;

APP_TIMER_DEF(m_coin_event_timer_id);
APP_TIMER_DEF(m_coin_event_delta_id);

void coin_event_timeout_handler(void* p_context)
{
		p_write++;
		new_event = true;
}

void coin_delta_timeout_handler(void* p_context)
{
		delta_seconds++;
}

void coin_event_timer_init(void)
{
		uint32_t                err_code;
		err_code = app_timer_create(&m_coin_event_timer_id,
																APP_TIMER_MODE_SINGLE_SHOT,
																coin_event_timeout_handler);
		APP_ERROR_CHECK(err_code);
	
		err_code = app_timer_create(&m_coin_event_delta_id,
																APP_TIMER_MODE_REPEATED,
																coin_delta_timeout_handler);
		APP_ERROR_CHECK(err_code);
	
		app_timer_start(m_coin_event_delta_id,
										COIN_DELTA_INTERVAL,
										NULL);
}

uint8_t *read_coin_event(void)
{
		gatts_formated[9] = coin_events_array[p_read].CHF_01;
		gatts_formated[8] = coin_events_array[p_read].CHF_02;
		gatts_formated[7] = coin_events_array[p_read].CHF_05;
		gatts_formated[6] = coin_events_array[p_read].CHF_1;
		gatts_formated[5] = coin_events_array[p_read].CHF_2;
		gatts_formated[4] = coin_events_array[p_read].CHF_5;
		gatts_formated[3] = coin_events_array[p_read].time_elapsed;
		gatts_formated[2] = coin_events_array[p_read].time_elapsed >> 8;
		gatts_formated[1] = coin_events_array[p_read].time_elapsed >> 16;
		gatts_formated[0] = coin_events_array[p_read].time_elapsed >> 24;
	
		p_read++;
	
		return gatts_formated;
}

void store_coin_event(uint8_t notification_code)
{
		if(new_event)
		{
				coin_events_array[p_write].time_elapsed = delta_seconds;
				new_event = false;
		}
		app_timer_start(m_coin_event_timer_id,
										COIN_EVENT_INTERVAL,
										NULL);
		
		switch(notification_code)
		{
			case 1:					// In: CHF -.10
				coin_events_array[p_write].CHF_01 ++;
				break;
			case 2:					// In: CHF -.20
				coin_events_array[p_write].CHF_02 ++;
				break;
			case 4:					// In: CHF -.50
				coin_events_array[p_write].CHF_05 ++;
				break;
			case 8:					// In: CHF 1.-
				coin_events_array[p_write].CHF_1 ++;
				break;
			case 16:				// In: CHF 2.-
				coin_events_array[p_write].CHF_2 ++;
				break;
			case 32:				// In: CHF 5.-
				coin_events_array[p_write].CHF_5 ++;
				break;
			case 65:				// Out: CHF -.10
				coin_events_array[p_write].CHF_01 --;
				break;
			case 66:				// Out: CHF -.20
				coin_events_array[p_write].CHF_02 --;
				break;
			case 68:				// Out: CHF -.50
				coin_events_array[p_write].CHF_05 --;
				break;
			case 72:				// Out: CHF 1.-
				coin_events_array[p_write].CHF_1 --;
				break;
			case 80:				// Out: CHF 2.-
				coin_events_array[p_write].CHF_2 --;
				break;
			case 96:				// Out: CHF 5.-
				coin_events_array[p_write].CHF_5 --;
				break;
			default:
				break;
		}
}

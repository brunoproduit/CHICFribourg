#include <stdint.h>
#include "app_timer.h"

#define COIN_EVENT_INTERVAL                MSEC_TO_UNITS(30000, UNIT_1_25_MS)           /**< Minimum acceptable connection interval (0.1 seconds). */
#define COIN_DELTA_INTERVAL                MSEC_TO_UNITS(1000, UNIT_1_25_MS)           /**< Minimum acceptable connection interval (0.1 seconds). */

typedef struct
{
    int8_t    CHF_01;           //
    int8_t    CHF_02;     			//
    int8_t  	CHF_05;						//
		int8_t  	CHF_1; 						//
		int8_t  	CHF_2; 						//
		int8_t  	CHF_5; 						//
		uint32_t	time_elapsed;			//
} coin_events_t;

void coin_event_timeout_handler(void* p_context);

void coin_delta_timeout_handler(void* p_context);
	
void coin_event_timer_init(void);

uint8_t *read_coin_event(void);

void store_coin_event(uint8_t notification_code);

#include <stdint.h>
#include "app_trace.h" 
#include "app_timer.h"
#include "motor_control.h"
#include "nrf_pwm.h"
#include "boards.h"


#define APP_TIMER_PRESCALER         0                                          /**< Value of the RTC1 PRESCALER register. */
#define MOTOR_INTERVAL      			 APP_TIMER_TICKS(10000, APP_TIMER_PRESCALER) /**< Battery level measurement interval (ticks). */

APP_TIMER_DEF(m_motor_timer_id);

void motor_pwm_init(void)
{
		nrf_pwm_config_t pwm_config = PWM_DEFAULT_CONFIG;
    
    pwm_config.mode             = PWM_MODE_LED_255;
    pwm_config.num_channels     = 2;
    pwm_config.gpio_num[0]      = BSP_LED_7;
    pwm_config.gpio_num[1]      = BSP_LED_8;
	
		// Initialize the PWM library
    nrf_pwm_init(&pwm_config);
}

void motor_timeout_handler(void* p_context)
{
	NRF_GPIO->OUTCLR = (BSP_LED_7_MASK | BSP_LED_8_MASK | BSP_LED_9_MASK);
}

void motor_timer_init(void)
{
	uint32_t                err_code;
	err_code = app_timer_create(&m_motor_timer_id,
                              APP_TIMER_MODE_SINGLE_SHOT,
															motor_timeout_handler);
	APP_ERROR_CHECK(err_code);
}

void motor_open()
{
		NRF_GPIO->OUTCLR = BSP_LED_7_MASK;
		NRF_GPIO->OUTSET = (BSP_LED_8_MASK | BSP_LED_9_MASK);
	
		uint32_t err_code;
    err_code = app_timer_start(m_motor_timer_id, MOTOR_INTERVAL, NULL);
    APP_ERROR_CHECK(err_code);
}

void motor_close()
{
		NRF_GPIO->OUTCLR = BSP_LED_8_MASK;
		NRF_GPIO->OUTSET = (BSP_LED_7_MASK | BSP_LED_9_MASK);
	
		uint32_t err_code;
    err_code = app_timer_start(m_motor_timer_id, MOTOR_INTERVAL, NULL);
    APP_ERROR_CHECK(err_code);
}

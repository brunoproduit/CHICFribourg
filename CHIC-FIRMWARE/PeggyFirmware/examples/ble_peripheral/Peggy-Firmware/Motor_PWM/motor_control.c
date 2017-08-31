#include <stdint.h>
#include "app_trace.h" 
#include "app_timer.h"
#include "app_pwm.h"
#include "nrf_delay.h"
#include "motor_control.h"
#include "boards.h"

#define APP_TIMER_PRESCALER         0                                          /**< Value of the RTC1 PRESCALER register. */
#define MOTOR_INTERVAL      			 APP_TIMER_TICKS(10000, APP_TIMER_PRESCALER) /**< Battery level measurement interval (ticks). */

APP_PWM_INSTANCE(PWM1,1);                   // Create the instance "PWM1" using TIMER1.
APP_PWM_INSTANCE(PWM2,2);                   // Create the instance "PWM1" using TIMER1.

static uint32_t value;
static bool motor_run;
static bool motor_dir;

void pwm_ready_callback(uint32_t pwm_id)    // PWM callback function
{
		static uint8_t i;
		i++;
	
		value = (i < 20) ? (i * 5) : (100 - (i - 20) * 5);
	
		if(i >= 40)
		{
			i = 0;
			//motor_run = false;
			//app_pwm_disable(&PWM1);
			//app_pwm_disable(&PWM2);
			LEDS_ON(BSP_LED_9_MASK);
			//app_pwm_disable(&PWM2);
		}
			//ready_flag = true;
		
		/*if(pwm_step < 40)
		{
			pwm_step = pwm_step + 1;
			value = (pwm_step < 20) ? (pwm_step * 5) : (100 - (pwm_step - 20) * 5);
			app_pwm_channel_duty_set(&PWM1, 1, value);
			if(pwm_step >= 3)
			{
				pwm_step = 0;
			}
		}*/
		
}

void motor_pwm_init(void)
{
	
		LEDS_ON(BSP_LED_9_MASK);
		
		ret_code_t err_code_pwm;
    
    /* 1-channel PWM, 200Hz, output on DK LED pins. */
		app_pwm_config_t pwm1_cfg = APP_PWM_DEFAULT_CONFIG_1CH(5000L,BSP_LED_8);
		app_pwm_config_t pwm2_cfg = APP_PWM_DEFAULT_CONFIG_1CH(5000L,BSP_LED_7);
			
    /* Switch the polarity of the second channel. */
    //pwm1_cfg.pin_polarity[0] = APP_PWM_POLARITY_ACTIVE_HIGH;
		//pwm2_cfg.pin_polarity[0] = APP_PWM_POLARITY_ACTIVE_HIGH;
    
    /* Initialize and enable PWM. */
    err_code_pwm = app_pwm_init(&PWM1,&pwm1_cfg,pwm_ready_callback);
    APP_ERROR_CHECK(err_code_pwm);
    app_pwm_enable(&PWM1);
	
		err_code_pwm = app_pwm_init(&PWM2,&pwm2_cfg,pwm_ready_callback);
    APP_ERROR_CHECK(err_code_pwm);
    app_pwm_enable(&PWM2);
		
		motor_run = true;
		motor_dir = true;
}

void motor_open()
{
		LEDS_OFF(BSP_LED_9_MASK);
    app_pwm_enable(&PWM1);
		motor_dir = true;
		motor_run = true;
}

void motor_close()
{
		//value = 0;
		//app_pwm_channel_duty_set(&PWM1, 0, value);
		//app_pwm_enable(&PWM2);
	
		LEDS_OFF(BSP_LED_9_MASK);
    app_pwm_enable(&PWM2);
		motor_dir = false;
		motor_run = true;
}

void motor_control(void)
{
		if(motor_run)
		{
			if(motor_dir)
			{
				while (app_pwm_channel_duty_set(&PWM1, 0, value) == NRF_ERROR_BUSY);
			}
			else
			{
				while (app_pwm_channel_duty_set(&PWM2, 0, value) == NRF_ERROR_BUSY);
      }
      nrf_delay_ms(25);
		}
}


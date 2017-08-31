/* Copyright (c) 2014 Nordic Semiconductor. All Rights Reserved.
 *
 * The information contained herein is property of Nordic Semiconductor ASA.
 * Terms and conditions of usage are described in detail in NORDIC
 * SEMICONDUCTOR STANDARD SOFTWARE LICENSE AGREEMENT.
 *
 * Licensees are granted free, non-transferable use of the information. NO
 * WARRANTY of ANY KIND is provided. This heading must NOT be removed from
 * the file.
 *
 */
#ifndef PEGGY_H
#define PEGGY_H

// LEDs definitions for PEGGY

// LEDs definitions for PCA10028
#define LEDS_NUMBER  	10

#define LED_CHF5			14
#define LED_CHF2			16
#define LED_CHF1			12
#define LED_CHF05			6
#define LED_CHF02			10
#define LED_CHF01			8
#define LED_EYES    	3
#define	MOTOR_EN			25
#define MOTOR_REVERSE	21
#define	MOTOR_FORWARD 23

#define BSP_LED_0      LED_EYES
#define BSP_LED_1      LED_CHF05
#define BSP_LED_2      LED_CHF01
#define BSP_LED_3      LED_CHF02
#define BSP_LED_4      LED_CHF1
#define BSP_LED_5      LED_CHF2
#define BSP_LED_6      LED_CHF5
#define BSP_LED_7			 MOTOR_REVERSE
#define BSP_LED_8			 MOTOR_FORWARD
#define BSP_LED_9			 MOTOR_EN


#define BSP_LED_0_MASK (1<<BSP_LED_0)
#define BSP_LED_1_MASK (1<<BSP_LED_1)
#define BSP_LED_2_MASK (1<<BSP_LED_2)
#define BSP_LED_3_MASK (1<<BSP_LED_3)
#define BSP_LED_4_MASK (1<<BSP_LED_4)
#define BSP_LED_5_MASK (1<<BSP_LED_5)
#define BSP_LED_6_MASK (1<<BSP_LED_6)
#define BSP_LED_7_MASK (1<<BSP_LED_7)
#define BSP_LED_8_MASK (1<<BSP_LED_8)
#define BSP_LED_9_MASK (1<<BSP_LED_9)

#define LEDS_MASK      (BSP_LED_0_MASK | BSP_LED_1_MASK | BSP_LED_2_MASK | BSP_LED_3_MASK | BSP_LED_4_MASK | BSP_LED_5_MASK | BSP_LED_6_MASK | BSP_LED_7_MASK | BSP_LED_8_MASK | BSP_LED_9_MASK)
#define	SENSOR_MASK		 (BSP_LED_1_MASK | BSP_LED_2_MASK | BSP_LED_3_MASK | BSP_LED_4_MASK | BSP_LED_5_MASK | BSP_LED_6_MASK)
#define	MOTOR_MASK		 (BSP_LED_7_MASK | BSP_LED_8_MASK | BSP_LED_9_MASK)
#define EYES_MASK			 (BSP_LED_0_MASK)
/* all LEDs are lit when GPIO is low */
#define LEDS_INV_MASK  LEDS_MASK


#define BUTTONS_NUMBER 9

#define COIN_IN   		 29
#define COIN_OUT       22
#define COIN_SENS      28
#define	CHF5_OUT			 5
#define	CHF2_OUT			 7
#define	CHF1_OUT			 9
#define	CHF05_OUT			 11
#define	CHF02_OUT			 13
#define	CHF01_OUT			 15


#define BUTTON_PULL    NRF_GPIO_PIN_PULLUP
#define BUTTON_PULLUP	 NRF_GPIO_PIN_PULLUP
#define BUTTON_PULLDOWN NRF_GPIO_PIN_PULLDOWN

#define BUTTONS_LIST {COIN_IN, COIN_OUT, COIN_SENS, CHF5_OUT, CHF2_OUT, CHF1_OUT, CHF05_OUT, CHF02_OUT, CHF01_OUT}

#define BSP_BUTTON_0   COIN_IN
#define BSP_BUTTON_1   COIN_OUT
#define BSP_BUTTON_2   COIN_SENS
#define BSP_BUTTON_3   CHF5_OUT
#define BSP_BUTTON_4   CHF2_OUT
#define BSP_BUTTON_5   CHF1_OUT
#define BSP_BUTTON_6   CHF05_OUT
#define BSP_BUTTON_7   CHF02_OUT
#define BSP_BUTTON_8   CHF01_OUT

#define BSP_BUTTON_0_MASK (1<<BSP_BUTTON_0)
#define BSP_BUTTON_1_MASK (1<<BSP_BUTTON_1)
#define BSP_BUTTON_2_MASK (1<<BSP_BUTTON_2)
#define BSP_BUTTON_3_MASK (1<<BSP_BUTTON_3)
#define BSP_BUTTON_4_MASK (1<<BSP_BUTTON_4)
#define BSP_BUTTON_5_MASK (1<<BSP_BUTTON_5)
#define BSP_BUTTON_6_MASK (1<<BSP_BUTTON_6)
#define BSP_BUTTON_7_MASK (1<<BSP_BUTTON_7)
#define BSP_BUTTON_8_MASK (1<<BSP_BUTTON_8)

#define BUTTONS_MASK   0x001E0000

	
// Low frequency clock source to be used by the SoftDevice
#ifdef S210
#define NRF_CLOCK_LFCLKSRC      NRF_CLOCK_LFCLKSRC_XTAL_20_PPM
#else
#define NRF_CLOCK_LFCLKSRC      {.source        = NRF_CLOCK_LF_SRC_XTAL,            \
                                 .rc_ctiv       = 0,                                \
                                 .rc_temp_ctiv  = 0,                                \
                                 .xtal_accuracy = NRF_CLOCK_LF_XTAL_ACCURACY_20_PPM}
#endif

#endif // PEGGY_H

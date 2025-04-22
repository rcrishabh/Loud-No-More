// ==UserScript==
// @name         Loud No More
// @namespace    https://github.com/Evilur
// @version      1.1
// @description  Protects your ears from sudden loud sounds on pages that contain only a media player
// @author       Evilur
// @license      MIT
// @homepageURL  https://github.com/Evilur/Loud-No-More
// @supportURL   https://github.com/Evilur/Loud-No-More/issues
// @updateURL    https://raw.githubusercontent.com/Evilur/Loud-No-More/master/Loud%20No%20More.js
// @downloadURL  https://raw.githubusercontent.com/Evilur/Loud-No-More/master/Loud%20No%20More.js
// @run-at       document-end
// @match        *://*/*
// @match        file:///*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    /* The default target volume. Uses for setting GM values */
    const DEFAULT_TARGET_VOLUME = 10;

    /** Get the target volume value through the GM
     *  @return the target volume percentage (numberic)
     */
    const get_target_volume = function() {
        /* Get the target volume value through the GM */
        let volume_value = GM_getValue('target_volume', DEFAULT_TARGET_VOLUME);

        /* Check for the NaN */
        if (!Number.isNaN(volume_value)) {
            /* Convert to the integer */
            volume_value = Number(volume_value);

            /* Return the target volume value */
            return volume_value;
        }

        /* If the value is NaN, set the default value */
        GM_setValue('target_volume', DEFAULT_TARGET_VOLUME);

        /* Return the default target volume value */
        return DEFAULT_TARGET_VOLUME;
    }

    /** Callback triggered when the user wants to change the target volume value variable */
    GM_registerMenuCommand('Volume', () => {
        /* Get user input */
        let new_value = prompt('Enter the volume percentage value', `${get_target_volume()}%`);

        /* If the user enter the data */
        if (new_value !== null) {
            /* Delete all the non-number characters */
            new_value = new_value.replace(/\D/g, '');

            /* If the user's input is invalid */
            if (String(new_value).length <= 0) {
                alert('Error: invalid input');
                return;
            }

            /* If the user's input is valid
             * Save the target volume value to the GM */
            GM_setValue('target_volume', Number(new_value));

            /* Tell the user that everything is alright */
            alert(`The volume value has been saved: ${new_value}%`);
        }
    });

    /* If this page is NOT the blank page with only a built-in player, exit the script */
    if (document.body.children.length != 1) return;

    /* Get the HTML element of the possible build-in player */
    const PLAYER_ELEMENT = document.body.firstElementChild;

    /* Get the tag type of the possible built-in player */
    const ELEMENT_TAG = PLAYER_ELEMENT.tagName.toLowerCase();

    /* If there is NOT a player but some other element, exit the script */
    if (ELEMENT_TAG !== 'audio' && ELEMENT_TAG !== 'video') return;

    /* Get the volume value to be set as an attribute for <audio> and <video> tags.
     * We need to get this value as a decimal fraction, where the value 1 is 100% */
    const TARGET_VOLUME = get_target_volume() / 100;

    /* Set the volume attribute */
    PLAYER_ELEMENT.volume = TARGET_VOLUME;
})();

"use strict";

/**
 * Constructor function for HueGrid
 * @param {Array} colors - Array of color hex values (without #)
 * @param {string} name - Name of the palette
 * @param {string} description - Optional description of the palette
 */
var HueGrid = function (colors, name, description) {
    this.colors = colors;
    this.name = name;
    this.description = description;
    this.initElements();
};

HueGrid.prototype = {
    /**
     * Initializes and renders the HueGrid widget
     */
    initElements: function () {
        var d = this,
            scriptElement = document.currentScript;

        // Create main widget container
        var container = document.createElement("div");
        container.classList.add("hue-grid");
        container.id = "palette-" + this.name.toLowerCase().replace(/\s+/g, '-');
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);

        // Create color grid container
        var colorContainer = document.createElement("div");
        colorContainer.classList.add("hue-grid_colors");

        // Generate color blocks
        this.colors.forEach(function (color) {
            var colorBlock = document.createElement("div");
            colorBlock.style.background = "#" + color;
            if (d.isLight(color)) colorBlock.classList.add("is-light");

            // Create span to show color code
            var colorLabel = document.createElement("span");
            colorLabel.innerHTML = "#" + color.toUpperCase();

            // Copy color code on click
            colorBlock.onclick = function () {
                colorLabel.innerHTML = "Copied!";
                d.copyText("#" + color);
            };

            // Restore color code text after 200ms when mouse leaves
            colorBlock.onmouseleave = function () {
                setTimeout(function () {
                    colorLabel.innerHTML = "#" + color.toUpperCase();
                }, 200);
            };

            colorBlock.appendChild(colorLabel);
            colorContainer.appendChild(colorBlock);
        });

        // Create palette info (name and share button)
        var infoContainer = document.createElement("div");
        infoContainer.classList.add("hue-grid_info");

        var paletteName = document.createElement("div");
        paletteName.classList.add("hue-grid_info_name");
        if (this.name) paletteName.innerHTML = this.name;
        infoContainer.appendChild(paletteName);

        // Create share button
        var shareButton = document.createElement("a");
        shareButton.href = "#";
        shareButton.classList.add("hue-grid_share");
        shareButton.innerHTML = "Share";
        shareButton.onclick = function (event) {
            event.preventDefault();
            var url = window.location.origin + window.location.pathname + "?palette=" + encodeURIComponent(d.name);
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function () {
                    shareButton.innerHTML = "Link Copied!";
                    setTimeout(function () {
                        shareButton.innerHTML = "Share";
                    }, 2000);
                });
            } else {
                d.copyText(url);
                shareButton.innerHTML = "Link Copied!";
                setTimeout(function () {
                    shareButton.innerHTML = "Share";
                }, 2000);
            }
        };
        infoContainer.appendChild(shareButton);

        container.appendChild(colorContainer);
        container.appendChild(infoContainer);

        // Add description if provided
        if (this.description) {
            var descriptionBox = document.createElement("div");
            descriptionBox.classList.add("hue-grid_description");
            descriptionBox.innerHTML = this.description;
            container.appendChild(descriptionBox);
            container.style.height = "auto";
        }

        // Inject CSS once
        if (document.getElementsByClassName("hue-grid-css").length === 0) {
            var style = document.createElement("style");
            style.classList.add("hue-grid-css");
            style.innerHTML = `
                :root {
                    --hg-background-color: #ffffff;
                    --hg-border-color: #000000;
                    --hg-font-size: 16px;
                    --hg-font-size-description: 14px;
                    --hg-font-color: #000000;
                    --hg-height: 150px;
                    --hg-margin: 2rem auto;
                    --hg-info-padding: 0 15px;
                    --hg-info-height: 36px;
                    --hg-hover-width: 80px;
                    --hg-transition-duration: 0.1s;
                    --hg-font-weight: bold;
                    --hg-light-color: #000000;
                    --hg-dark-color: #ffffff;
                }
                .hue-grid {
                    all: unset;
                    background: var(--hg-background-color);
                    border: 1px solid var(--hg-border-color);
                    display: block;
                    overflow: hidden;
                    height: var(--hg-height);
                    margin: var(--hg-margin);
                    font-size: var(--hg-font-size);
                    color: var(--hg-font-color);
                }
                .hue-grid_colors {
                    display: flex;
                    width: 100%;
                    height: calc(var(--hg-height) - var(--hg-info-height));
                }
                .hue-grid_colors div {
                    flex-grow: 1;
                    transition: all var(--hg-transition-duration) ease-in-out;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    border-right: 1px solid var(--hg-border-color);
                }
                .hue-grid_colors div:last-child {
                    border-right: 0;
                }
                .hue-grid_colors div span {
                    width: 100%;
                    text-align: center;
                    display: block;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--hg-dark-color);
                    opacity: 0;
                    transition: all var(--hg-transition-duration) ease-in-out;
                    font-size: 15px;
                    font-weight: var(--hg-font-weight);
                }
                .hue-grid_colors div.is-light span {
                    color: var(--hg-light-color);
                }
                .hue-grid_colors div:hover {
                    flex-basis: var(--hg-hover-width);
                }
                .hue-grid_colors div:hover span {
                    opacity: 1;
                }
                .hue-grid_info {
                    padding: var(--hg-info-padding);
                    height: var(--hg-info-height);
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    border-top: 1px solid var(--hg-border-color);
                }
                .hue-grid_info_name {
                    font-weight: var(--hg-font-weight);
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .hue-grid_share {
                    margin-left: auto;
                    text-decoration: underline;
                    color: var(--hg-font-color);
                    transition: color 0.2s ease-in-out;
                }
                .hue-grid_share:hover {
                    color: var(--hg-border-color);
                }
                .hue-grid_description {
                    font-size: var(--hg-font-size-description);
                    padding: 10px 15px;
                    color: var(--hg-font-color);
                    border-top: 1px solid var(--hg-border-color);
                }
            `;
            document.head.appendChild(style);
        }
    },

    /**
     * Copies a given text to the clipboard
     * @param {string} text - The text to copy
     */
    copyText: function (text) {
        var textarea = document.createElement("textarea");
        textarea.style.cssText = "position:absolute;left:-9999px";
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
        } catch (error) {
            console.error("Failed to copy text", error);
        }
        window.getSelection().removeAllRanges();
        textarea.remove();
    },

    /**
     * Determines if a color is light based on its hex value
     * @param {string} color - The hex color code (without #)
     * @returns {boolean} True if the color is light
     */
    isLight: function (color) {
        var rgb = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        var r = parseInt(rgb[1], 16),
            g = parseInt(rgb[2], 16),
            b = parseInt(rgb[3], 16);
        return (299 * r + 587 * g + 114 * b) / 1000 >= 160;
    }
};

// Highlight selected palette from URL
document.addEventListener("DOMContentLoaded", function () {
    var urlParams = new URLSearchParams(window.location.search);
    var selectedPalette = urlParams.get("palette");
    if (selectedPalette) {
        var paletteId = "palette-" + selectedPalette.toLowerCase().replace(/\s+/g, '-');
        var widget = document.getElementById(paletteId);
        if (widget) {
            widget.scrollIntoView({ behavior: "smooth", block: "center" });
            var infoName = widget.querySelector(".hue-grid_info");
            var shareLink = widget.querySelector(".hue-grid_share");
            var originalInfoBackground = infoName.style.backgroundColor;
            var originalShareColor = shareLink.style.color;
            var blinkCount = 0;

            var blinkInterval = setInterval(function () {
                if (blinkCount >= 6) {
                    clearInterval(blinkInterval);
                    // Restore original styles
                    infoName.style.backgroundColor = originalInfoBackground;
                    shareLink.style.color = originalShareColor;
                    return;
                }
                if (blinkCount % 2 === 0) {
                    infoName.style.backgroundColor = "black";
                    shareLink.style.color = "white";
                } else {
                    infoName.style.backgroundColor = originalInfoBackground;
                    shareLink.style.color = originalShareColor;
                }
                blinkCount++;
            }, 500);
        }
    }
});

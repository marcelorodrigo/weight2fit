# Weight 2 FIT

A privacy-first tool to import body composition measurements from any source into Garmin Connect, without compromising your account security or sharing data with third-party servers.

## The Problem

Most third-party sync tools for body scales and Garmin Connect either require you to disable two-factor authentication or relay your health data through their own servers. Garmin Connect on the other hand allows you to import FIT files that contain body weight composition information into your platform.

## The Solution

Weight2Fit generates a standard Garmin FIT weight-scale file **directly in your browser**. Your data never leaves your device, and you maintain complete control over your privacy and security.

You just need to manually type in your measurements, download the file, and import it into Garmin Connect. That's a small price to pay for security and privacy.

## How It Works

1. **Enter your data** — Body composition measurements from your scale. Weight is required; body fat %, bone mass, muscle mass, body water %, visceral fat rating, metabolic age, and additional optional measurements are available.

2. **Generate & download** — The app encodes your data into a standard Garmin FIT weight-scale file using the official Garmin JavaScript FIT SDK, running entirely in your browser.

3. **Import into Garmin Connect** — Go to [connect.garmin.com](https://connect.garmin.com), navigate to **Health Stats → Body Composition**, and use the import button to upload the `.fit` file.

## Why This Approach?

- **Your data stays on your device** — No third-party servers, no data relay
- **100% client-side** — Powered by the official Garmin FIT SDK
- **Standard format** — Creates legitimate Garmin FIT files compatible with all Garmin services
- **No account compromise** — You control when and what gets imported
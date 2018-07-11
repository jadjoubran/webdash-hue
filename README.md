# webdash hue

Control your Philips hue lights straight from your dashboard

```bash
npm install --save-dev webdash-hue
```

![Webdash hue preview](https://i.imgur.com/yNBDyW2.png)

## Features

- Switch lights on/off
- Set lights' brightness
- Enable custom presets with different settings

## Configuration

You can add as many presets as you want. Here's the format for a sample present that uses `ct` (colorTemp) as a colorMode

```json
{
  "name": "Warm",
  "on": true,
  "brightness": 70,
  "colorMode": "ct",
  "colorTemp": 500
}
```

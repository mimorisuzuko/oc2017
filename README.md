# Open Campus 2017

## Setup

### Client

```zsh
git clone https://github.com/mimorisuzuko/oc2017.git
cd oc2017
yarn
```

### Server

Ref. http://qiita.com/PonDad/items/9a6dbd6957df06a4532e

```zsh
sudo apt-get install libv4l-dev libjpeg8-dev imagemagick
sudo apt-get install cmake
git clone https://github.com/jacksonliam/mjpg-streamer.git
cd mjpg-streamer/mjpg-streamer-experimental
make
```

`~/start.sh`

```sh
cd mjpg-streamer/mjpg-streamer-experimental
./mjpg_streamer -o "./output_http.so -w ./www -p 8000" -i "./input_raspicam.so -fps 30 -q 50"
```

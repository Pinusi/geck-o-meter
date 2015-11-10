# geck-o-meter

## Install
1. Clone the repo.
2. Make sure you have node installed, then go into the tools folder and run `npm install`.
3. After installing all the dependecies, still  in the tools folder run `grunt`.
4. This is going to open the page with the meter.

## Structure
The widget is connected to this endpont: https://widgister.herokuapp.com/challenge/frontend. It renders the data differently depending on values</br>

### Front-end
The app preloads the data then render the widget and finally animate.</br>
For the animations I've used Snap.svg and simple css, just to demonstrate both usages.</br>
Widget is responsive and linked to rems, I know the basic rem should be 16 but for now is 10 to demonstrate the scaling.</br>
Code is commented to explain all the passages.</br>
In the spec folder there are also some testing cases.</br></br>

**Potential Improvements**</br>
1. Better animation on numbers.</br>
2. Improve the testing cases.</br>
3. Improve animations for strange cases, like max < min or value > max, etc...</br>

import * as scroll from 'scroll';
const target = document.getElementById('app');
export default () => scroll.top(target, 0, {duration: 300});

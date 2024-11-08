import address from '../db/addressDb.js';
const count_len = 26;

for (let index = 0; index < count_len; index++) {
    let s = '';
    let i1 = +(Math.random() * address.length - 1).toFixed(0);
    let a = address[Math.max(0, i1)];
    // console.log(a, i1);

    s += a ? a.Name : '';

    if (a.Districts) {
        let i2 = +(Math.random() * a.Districts.length - 1).toFixed(0);
        let a1 = a.Districts[i2];
        // console.log(a1, i2);

        s += ' - ' + (a1 ? a1.Name : '');

        if (a1 && a1.Wards) {
            let i3 = +(Math.random() * a1.Wards.length - 1).toFixed(0);
            let a2 = a1.Wards[i3];
            // console.log(a2, i3);

            s += ' - ' + (a2 ? a2.Name : '');
        }
    }

    console.log(s);
}

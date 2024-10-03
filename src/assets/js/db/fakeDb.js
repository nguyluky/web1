/**
 *
 * @typedef {{
 *  id: string;
 *  title: string;
 *  details: string;
 *  thumbnal: string;
 *  imgs: string[];
 *  base_price: number;
 *  category: string[];
 *  option?: Option[]
 * }} Sach
 *
 * @typedef {{
 *   id: string;
 *   short_name: string;
 *   long_name: string;
 *   img?: string
 *   price: number
 *  }} Option
 *
 * @typedef {{
 *  id: string;
 *  name: string;
 *  long_name?: string;
 * }} Category
 *
 * @typedef {{
 *  id: string;
 *  user_id: string;
 *  sach: number;
 *  option_id?: number;
 *  quantity: number;
 *  status: "suly" | "doixacnhan" | "thanhcong";
 * }} Cart
 *
 * @typedef {{
 *  id: string;
 *  email: string;
 *  name: string;
 *  passwd: string;
 *  phone_num: string;
 *  rule?: 'admin' | 'user';
 * }} UserInfo
 * 
 * 
 * @typedef {{
 *  id: string,
 *  data: string
 * }} imgStore
 *

 */

import uuidv4 from '../until/uuid.js';
import sanhs from './sachDb.js';
// @ts-ignore
import imgs from './imgStore.js';

/**
 *
 * lưu toàn bộ thông tin
 *
 * @type {{
 * user_info: UserInfo[];
 * category: Category[];
 * cart: Cart[];
 * sach: Sach[];
 * imgs: imgStore[];
 * }}
 */
const cache = {
    user_info: [
        {
            id: '49790139',
            name: 'Audrey Hyatt IV',
            email: 'Rose.Haley@hotmail.com',
            phone_num: '0539628275',
            passwd: 'jmembRtsuoo1tYI',
        },
        {
            id: '69451623',
            name: 'Della Yundt',
            email: 'Nelda.Goyette10@yahoo.com',
            phone_num: '0592417222',
            passwd: 'ax5wOXVWX9c6SHb',
        },
        {
            id: '44507506',
            name: 'Elias Conn',
            email: 'Broderick_Schoen@yahoo.com',
            phone_num: '0852715368',
            passwd: 'bhBBiBvhItPkKBW',
        },
        {
            id: '94327975',
            name: 'Kristina Altenwerth MD',
            email: 'Flo.Upton@hotmail.com',
            phone_num: '0748584339',
            passwd: 'gy3cM6hQh4xdR1F',
        },
        {
            id: '01052182',
            name: 'Edith Bosco',
            email: 'Keyon81@yahoo.com',
            phone_num: '0921953547',
            passwd: 'zxk6dV_CV48g03z',
        },
        {
            id: '53908722',
            name: "Marianne O'Conner",
            email: 'Aliya_Schulist45@yahoo.com',
            phone_num: '0549373213',
            passwd: 'iD54h0B9m3yWRpx',
        },
        {
            id: '62307757',
            name: 'Kim Morissette',
            email: 'Uriel.Wiegand@hotmail.com',
            phone_num: '0936163721',
            passwd: 'FZ1BbQLoM1PumSA',
        },
        {
            id: '29358828',
            name: 'Greg Mayer',
            email: 'Brandon1@yahoo.com',
            phone_num: '0879199239',
            passwd: 'XHaFxWskD9Zo4WH',
        },
        {
            id: '63265670',
            name: 'Robert Gislason',
            email: 'Jammie41@yahoo.com',
            phone_num: '0825656372',
            passwd: 'ab3IA5ltyvk_R8r',
        },
        {
            id: '55881507',
            name: 'Lillie Heathcote',
            email: 'Anne23@hotmail.com',
            phone_num: '0823264645',
            passwd: 'AN6qYpxTwM95J3N',
        },
        {
            id: '43702526',
            name: 'Glenn Brakus IV',
            email: 'Pattie62@gmail.com',
            phone_num: '0331789786',
            passwd: 'FsqBTs4oreciZGl',
        },
        {
            id: '70579732',
            name: 'Angelica Langworth',
            email: 'Letitia.Bayer@hotmail.com',
            phone_num: '0722586696',
            passwd: 'mLBuS0WgxCermbN',
        },
        {
            id: '64184552',
            name: 'Esther Rohan IV',
            email: 'Cole.Thompson@yahoo.com',
            phone_num: '0935874116',
            passwd: 'QvT5gm9VdMD6QbL',
        },
        {
            id: '43186083',
            name: 'Dr. Randall Schumm',
            email: 'Lisette60@hotmail.com',
            phone_num: '0746777773',
            passwd: 'FEgpKKXNNmGkv_j',
        },
        {
            id: '01766065',
            name: 'Roosevelt Volkman',
            email: 'Burnice83@yahoo.com',
            phone_num: '0573914147',
            passwd: '1OuntqnXlSPjwCx',
        },
        {
            id: '40529803',
            name: 'Patsy Hansen PhD',
            email: 'Sheridan45@hotmail.com',
            phone_num: '0519325998',
            passwd: '08DyuzWqDx6G6B1',
        },
        {
            id: '86149811',
            name: 'Ted Jacobi',
            email: 'Dortha49@yahoo.com',
            phone_num: '0936461756',
            passwd: 'iYd3KtDZ0Hi3o0N',
        },
        {
            id: '30937427',
            name: 'Erin Brown',
            email: 'Elyse22@hotmail.com',
            phone_num: '0878263497',
            passwd: 'basjBFrRymKcbhK',
        },
        {
            id: '59168014',
            name: 'Maggie Mayert',
            email: 'Doris_MacGyver35@hotmail.com',
            phone_num: '0526784469',
            passwd: 'IRmEB5qiKfg0625',
        },
        {
            id: '51214370',
            name: 'Walter Feeney',
            email: 'Corbin_Von55@yahoo.com',
            phone_num: '0551767911',
            passwd: 'NDj0G4yISGKfA2K',
        },
        {
            id: '79286879',
            name: 'Zachary Blanda',
            email: 'Tiana_Hauck74@gmail.com',
            phone_num: '0554285315',
            passwd: 'eSKOW44eqQW9ZBv',
        },
        {
            id: '18761797',
            name: 'Andrew Lemke',
            email: 'Krystina55@gmail.com',
            phone_num: '0733967134',
            passwd: 'VcGi4egHy9r6foR',
        },
        {
            id: '57077347',
            name: 'Hazel Berge',
            email: 'Meaghan.Herzog52@hotmail.com',
            phone_num: '0881319643',
            passwd: '4LMKoYIYABa96Mv',
        },
        {
            id: '34678544',
            name: 'Benjamin Kemmer',
            email: 'Sylvia_Moen50@hotmail.com',
            phone_num: '0589171618',
            passwd: 'f8cVTzrcp2VJzro',
        },
        {
            id: '08445288',
            name: 'Ed Harber',
            email: 'Deja_OKeefe@yahoo.com',
            phone_num: '0746283785',
            passwd: 'VdeVlQ5lvcjG21G',
        },
        {
            id: '92845903',
            name: 'Janis Mraz',
            email: 'Demond.Schimmel@hotmail.com',
            phone_num: '0724492992',
            passwd: 'Orun2yX8vUKVxNK',
        },
        {
            id: '69632002',
            name: 'Cedric Daniel II',
            email: 'Oleta69@hotmail.com',
            phone_num: '0377647518',
            passwd: '7dEP01UmQtj2LzI',
        },
        {
            id: '34616382',
            name: 'Guadalupe Considine',
            email: 'John_Gulgowski67@gmail.com',
            phone_num: '0752192544',
            passwd: 'TVVMxIYqhOXHxO3',
        },
        {
            id: '94711650',
            name: 'Norman Bode',
            email: 'Aubrey.Abernathy6@hotmail.com',
            phone_num: '0824118545',
            passwd: 'EMYHCgjUxuaB68J',
        },
        {
            id: '95099050',
            name: 'Angelo Schultz',
            email: 'Abby98@yahoo.com',
            phone_num: '0849732739',
            passwd: 'S6CDgLfNKZucSsG',
        },
        {
            id: '02207480',
            name: 'Lester Fahey',
            email: 'Cale.Abernathy97@hotmail.com',
            phone_num: '0397591163',
            passwd: 'Z5bEFEz_XIAHiGr',
        },
        {
            id: '35529289',
            name: 'Bridget Gusikowski',
            email: 'Ryder_Heaney47@yahoo.com',
            phone_num: '0738154437',
            passwd: 'rs76ECWRkDtenBO',
        },
        {
            id: '57355297',
            name: 'Kenneth Kris Jr.',
            email: 'Newell_Ruecker@gmail.com',
            phone_num: '0389249689',
            passwd: '8Ii0SBl3inZLQd0',
        },
        {
            id: '46884804',
            name: 'Peter Kihn',
            email: 'Jordon_Bergnaum@yahoo.com',
            phone_num: '0736291618',
            passwd: 'B7GzzdAvGJy7oz_',
        },
        {
            id: '62058676',
            name: 'Lindsey Schultz',
            email: 'Amiya_Christiansen61@hotmail.com',
            phone_num: '0352394853',
            passwd: '4otOYFSQr2gtHV6',
        },
        {
            id: '65728131',
            name: 'Dale Muller',
            email: 'Hannah.McLaughlin@yahoo.com',
            phone_num: '0529654618',
            passwd: 'Jx2XrwZoftweJRz',
        },
        {
            id: '59022876',
            name: 'Gabriel Bechtelar',
            email: 'Katarina.Douglas72@yahoo.com',
            phone_num: '0778958664',
            passwd: 'IrhLmhMNbKKBcaQ',
        },
        {
            id: '66621971',
            name: 'Jesse Hudson',
            email: 'Emmett.Schultz@yahoo.com',
            phone_num: '0789846998',
            passwd: 'bZO407LT3AOfsem',
        },
        {
            id: '35814787',
            name: 'Percy Bechtelar',
            email: 'Jennifer.Swift79@hotmail.com',
            phone_num: '0832816233',
            passwd: 'NuqopCxYn3tIrlE',
        },
        {
            id: '69858110',
            name: 'Dr. Fernando Gleichner DVM',
            email: 'Una46@yahoo.com',
            phone_num: '0762318964',
            passwd: 'waoY2GbB4P2ou8X',
        },
        {
            id: '03100231',
            name: 'Ira Kovacek',
            email: 'Reynold27@yahoo.com',
            phone_num: '0965347276',
            passwd: '3eK31pgbY88AmmU',
        },
        {
            id: '02894477',
            name: 'Gloria Kuhlman',
            email: 'Kelly_Abbott@gmail.com',
            phone_num: '0729323735',
            passwd: '6Y12BqewIBEkHTn',
        },
        {
            id: '64358721',
            name: 'Perry Friesen-Huel',
            email: 'Glen.Schamberger@hotmail.com',
            phone_num: '0773283931',
            passwd: 'xQbYHgPTUcFydrs',
        },
        {
            id: '16290093',
            name: 'Stanley Kuvalis-Hayes',
            email: 'Sylvan.McKenzie@yahoo.com',
            phone_num: '0866967232',
            passwd: 'bVCP_ydYbWJg4iR',
        },
        {
            id: '10922517',
            name: 'Milton Rutherford Sr.',
            email: 'Araceli.Gorczany76@yahoo.com',
            phone_num: '0949864886',
            passwd: 'J55pEbyOABO9wYe',
        },
        {
            id: '70040260',
            name: 'Sadie Hane',
            email: 'Eloise_Walter52@hotmail.com',
            phone_num: '0574617826',
            passwd: 'gTjfZ26SjHvm5yY',
        },
        {
            id: '13899899',
            name: 'Jon Bednar',
            email: 'Eldred_Hermiston47@hotmail.com',
            phone_num: '0589589427',
            passwd: 'qmqunEzKFw6TKwZ',
        },
        {
            id: '85961783',
            name: 'Eugene Kilback',
            email: 'Aron_Cummerata-Dickens@gmail.com',
            phone_num: '0342789414',
            passwd: 'k960uO9CYOEcOPT',
        },
        {
            id: '60332211',
            name: 'Clarence Watsica',
            email: 'Tre85@yahoo.com',
            phone_num: '0325885718',
            passwd: 'Ob1_xJxxOMm9zF7',
        },
        {
            id: '96590138',
            name: 'Amelia Kutch II',
            email: 'Edyth.White43@yahoo.com',
            phone_num: '0786368749',
            passwd: '4kB83cAsatuUfwJ',
        },
        {
            id: '89380380',
            name: 'Dana Harvey',
            email: 'Rozella69@yahoo.com',
            phone_num: '0535533673',
            passwd: 'zGgH9oXNF6ai1VM',
        },
        {
            id: '68180665',
            name: 'Isaac Brown PhD',
            email: 'Valentin.Willms40@hotmail.com',
            phone_num: '0771753581',
            passwd: 'iYzbtNg_0qg2Grf',
        },
        {
            id: '38850704',
            name: 'Lucy Dicki',
            email: 'Marcel_Kris83@gmail.com',
            phone_num: '0969877919',
            passwd: 'DvnBUKaU7A0jQWl',
        },
        {
            id: '26910964',
            name: "Dr. Estelle O'Hara",
            email: 'Meggie54@gmail.com',
            phone_num: '0551252268',
            passwd: 'ydKFO97DqwzTX5z',
        },
        {
            id: '47074258',
            name: 'Eddie Fisher',
            email: 'Waino58@hotmail.com',
            phone_num: '0538373487',
            passwd: '7tZCr4nxlCnQrLy',
        },
        {
            id: '82499659',
            name: 'Julio Gerlach II',
            email: 'Vincenzo_Moen78@gmail.com',
            phone_num: '0556886215',
            passwd: 'EyOysF5g1Qm93Hx',
        },
        {
            id: '39959863',
            name: 'Michelle Zboncak',
            email: 'Jamarcus.Rice@yahoo.com',
            phone_num: '0872731138',
            passwd: '5FPfnmNARFBd2RS',
        },
        {
            id: '13112240',
            name: 'Regina Olson',
            email: 'Carli65@hotmail.com',
            phone_num: '0517987593',
            passwd: 'NWcheBx6pUsoqmW',
        },
        {
            id: '19579079',
            name: 'Miss Sally Wilkinson-Cruickshank',
            email: 'Stephan.Anderson@yahoo.com',
            phone_num: '0799183735',
            passwd: 'XtS8UOF3jC8S_E5',
        },
        {
            id: '08791856',
            name: 'Evan Feeney',
            email: 'Ola_Braun@yahoo.com',
            phone_num: '0868768513',
            passwd: '7_LnmJKVGtc2SVD',
        },
        {
            id: '92138385',
            name: 'Delia Baumbach',
            email: 'Gage31@gmail.com',
            phone_num: '0513892387',
            passwd: 'UMqrLRD_2OkZuS6',
        },
        {
            id: '94888677',
            name: 'Danny Schoen',
            email: 'Wade75@gmail.com',
            phone_num: '0916635117',
            passwd: '2OJqyYQLdQWUJ3T',
        },
        {
            id: '15180955',
            name: 'Lynn Hamill',
            email: 'Loraine_Armstrong55@hotmail.com',
            phone_num: '0355793492',
            passwd: '8mR_5uIiqDKByIB',
        },
        {
            id: '06295670',
            name: 'Warren Dare',
            email: 'Karine86@hotmail.com',
            phone_num: '0591159732',
            passwd: 'TXN_MpsYnJtWcSZ',
        },
        {
            id: '36638680',
            name: 'Aaron Brown',
            email: 'Justus_Russel16@gmail.com',
            phone_num: '0396428965',
            passwd: 'R7b9HsKoVRfylKa',
        },
        {
            id: '12840793',
            name: 'Ellen Gulgowski',
            email: 'Kaci86@hotmail.com',
            phone_num: '0541947582',
            passwd: 'e4YsCwaPgHSaQEA',
        },
        {
            id: '22746783',
            name: 'Suzanne Barrows',
            email: 'Stewart.Johnston@yahoo.com',
            phone_num: '0926131669',
            passwd: 'krY7t2wgY7sT_ht',
        },
        {
            id: '22190511',
            name: 'Kenneth Padberg I',
            email: 'Cynthia.Paucek30@gmail.com',
            phone_num: '0796785418',
            passwd: 'S6BR_3MAc6EqRP9',
        },
        {
            id: '61046961',
            name: 'Barry Haley III',
            email: 'Krystal_Predovic96@hotmail.com',
            phone_num: '0961614293',
            passwd: '2o7Cyf3NRmFn0SJ',
        },
        {
            id: '71294592',
            name: 'Bryant Upton',
            email: 'Abdiel73@yahoo.com',
            phone_num: '0341154764',
            passwd: '2XIC3YIPZ_T3efK',
        },
        {
            id: '06519053',
            name: 'Laverne Hermiston',
            email: 'Yesenia62@gmail.com',
            phone_num: '0854198563',
            passwd: 'e2eJSj6FQNhbWWC',
        },
        {
            id: '34519360',
            name: 'Dennis Murphy',
            email: 'Lulu73@yahoo.com',
            phone_num: '0559384721',
            passwd: '7oQeUdpJhIxJPSg',
        },
        {
            id: '00314887',
            name: 'Elmer Botsford',
            email: 'Stephany66@gmail.com',
            phone_num: '0572259228',
            passwd: 'ym48gAae3PGtNvN',
        },
        {
            id: '77253020',
            name: 'Ella Connelly-Labadie',
            email: 'Therese_Rodriguez@hotmail.com',
            phone_num: '0788467933',
            passwd: 'lSyLrphHSHhr1_k',
        },
        {
            id: '80797581',
            name: 'Peter Simonis',
            email: 'Kallie.Littel3@hotmail.com',
            phone_num: '0337988147',
            passwd: 'QIu3V5_TJVWgTB_',
        },
        {
            id: '35982281',
            name: 'Francis Wolf',
            email: 'Jay.Balistreri@yahoo.com',
            phone_num: '0749188993',
            passwd: 'wY0Eqcwbi2czty9',
        },
        {
            id: '29906871',
            name: 'Steve Moore',
            email: 'Durward60@yahoo.com',
            phone_num: '0731981557',
            passwd: 'KqWR_quOW__1vNt',
        },
        {
            id: '07670224',
            name: 'Bethany Deckow-Moore',
            email: 'Gene.Balistreri@gmail.com',
            phone_num: '0531453916',
            passwd: 'kLWZm9GNuxGDrRc',
        },
        {
            id: '95982620',
            name: 'Tracy Ebert',
            email: 'Alejandra.Wehner@gmail.com',
            phone_num: '0825678619',
            passwd: 'fCLtar4Wg2GOsum',
        },
        {
            id: '00042081',
            name: 'Sara Lebsack DDS',
            email: 'Osbaldo_Wuckert41@hotmail.com',
            phone_num: '0982992332',
            passwd: '95HZT8Eg8dILsqs',
        },
        {
            id: '97641653',
            name: 'Jill Heathcote',
            email: 'Frankie82@gmail.com',
            phone_num: '0827249745',
            passwd: 'QUY6FzoUVABTuUc',
        },
        {
            id: '67446363',
            name: 'Elizabeth McLaughlin',
            email: 'Reanna22@yahoo.com',
            phone_num: '0967323213',
            passwd: 'st91cxSV85T3AWb',
        },
        {
            id: '20919729',
            name: 'Beverly Bins',
            email: 'Kari_Tillman@gmail.com',
            phone_num: '0551189462',
            passwd: 'FQbBXyalMragW95',
        },
        {
            id: '98406133',
            name: 'Charlene Erdman',
            email: 'Jennyfer_Yundt-Durgan25@hotmail.com',
            phone_num: '0871828845',
            passwd: 'FnZp8agxANj37qP',
        },
        {
            id: '05027540',
            name: 'Marcella Prosacco',
            email: 'Hayden.Stiedemann@hotmail.com',
            phone_num: '0715253537',
            passwd: 'fv2hHVYl1kwcFVs',
        },
        {
            id: '64063946',
            name: 'Jacquelyn Reichel',
            email: 'Lavonne94@yahoo.com',
            phone_num: '0916817413',
            passwd: 'o6aOTOalA_7ON3t',
        },
        {
            id: '91168745',
            name: 'Kay Terry',
            email: 'Johathan.Maggio64@hotmail.com',
            phone_num: '0958732931',
            passwd: 'E5oh2Rtap2PcFx8',
        },
        {
            id: '10490633',
            name: 'Darlene Farrell',
            email: 'Trevion_Bruen-Herman47@hotmail.com',
            phone_num: '0724489897',
            passwd: 'z_1R6e7hYZAt8Ag',
        },
        {
            id: '41315362',
            name: 'Derek Barton',
            email: 'Reba24@hotmail.com',
            phone_num: '0785647756',
            passwd: '29Is7SPdw9kciaa',
        },
        {
            id: '97302226',
            name: 'Lila Turner',
            email: 'Asha32@yahoo.com',
            phone_num: '0725877543',
            passwd: 'mQVLjLdkFT6i6c9',
        },
        {
            id: '43039266',
            name: 'Mr. Wilfred Predovic',
            email: 'Dayna14@hotmail.com',
            phone_num: '0953923691',
            passwd: 'WV0DCYxyRRQOaM1',
        },
        {
            id: '90389012',
            name: 'Dianne Schinner',
            email: 'Eldred.Conroy@hotmail.com',
            phone_num: '0826547451',
            passwd: 'lY71jW85M1O3kMK',
        },
        {
            id: '51549111',
            name: 'Darryl Trantow',
            email: 'Rhianna.Beatty0@gmail.com',
            phone_num: '0373821525',
            passwd: 'CSs4lgnzy6EPjoJ',
        },
        {
            id: '57632301',
            name: "Sheryl O'Kon I",
            email: 'Jacklyn_Gleason18@yahoo.com',
            phone_num: '0976393978',
            passwd: 'NLGW88BktjOJnSo',
        },
        {
            id: '70618506',
            name: 'Sherry Shanahan',
            email: 'Allison_Wyman@hotmail.com',
            phone_num: '0351922148',
            passwd: 'N5pj2y3XI4gdAwq',
        },
        {
            id: '33559379',
            name: 'Alvin Bahringer',
            email: 'Olen_Howe@hotmail.com',
            phone_num: '0599336951',
            passwd: 'cg4GipUhS2_pniV',
        },
        {
            id: '63082977',
            name: 'Meredith Ferry',
            email: 'Geo21@yahoo.com',
            phone_num: '0722546876',
            passwd: 'JAI5XTwLcnpt5cJ',
        },
        {
            id: '61353710',
            name: 'Dianne Oberbrunner',
            email: 'Donnell_Wilderman66@yahoo.com',
            phone_num: '0861416714',
            passwd: 'eSdfcj9OR4ofgGt',
        },
        {
            id: '81294933',
            name: 'Renee Grady DVM',
            email: 'Kirstin.Russel21@hotmail.com',
            phone_num: '0749267278',
            passwd: 'ppurc2QSPHDZKqB',
        },
        {
            id: '24884559',
            name: 'Lester Daugherty',
            email: 'Sanford81@gmail.com',
            phone_num: '0533784813',
            passwd: 'qM0iRPax6vGnUXh',
        },
    ],
    category: [
        {
            id: 'mc',
            name: 'môn chung',
            long_name: 'môn chung',
        },
        {
            id: 'hoidap',
            name: 'hỏi đáp',
            long_name: 'hỏi đáp',
        },
        {
            id: 'QD',
            name: 'Khoa Quản trị Kinh doanh',
        },
        {
            id: 'VD',
            name: 'Khoa Văn hoá và Du lịch',
        },
        {
            id: 'KT',
            name: 'Khoa SP Kĩ thuật',
        },
        {
            id: '09',
            name: 'Phòng Giáo dục thường xuyên',
        },
        {
            id: 'CT',
            name: 'Khoa Công nghệ thông tin',
        },
        {
            id: 'TT',
            name: 'Khoa Thư viện - Văn phòng',
        },
        {
            id: 'GM',
            name: 'Khoa Giáo dục Mầm non',
        },
        {
            id: 'NN',
            name: 'Khoa Ngoại ngữ',
        },
        {
            id: 'XH',
            name: 'Khoa SP Khoa học Xã hội',
        },
        {
            id: 'TD',
            name: 'Khoa Toán - ứng dụng',
        },
        {
            id: 'TE',
            name: 'Khoa Tài chính - Kế toán',
        },
        {
            id: 'QG',
            name: 'Khoa Giáo dục',
        },
        {
            id: 'MO',
            name: 'Khoa Môi trường',
        },
        {
            id: 'TN',
            name: 'Khoa SP Khoa học Tự nhiên',
        },
        {
            id: 'GT',
            name: 'Khoa Giáo dục Tiểu học',
        },
        {
            id: 'NT',
            name: 'Khoa Nghệ thuật',
        },
        {
            id: 'LU',
            name: 'Khoa Luật',
        },
        {
            id: 'DV',
            name: 'Khoa Điện tử viễn thông',
        },
        {
            id: 'LC',
            name: 'Khoa Giáo dục chính trị',
        },
    ],
    cart: [],
    sach: sanhs,
    imgs: imgs,
};

/**
 * lấy
 * lấy tất cả
 * delete
 * update
 * thêm
 */

class FakeDatabase {
    /**
     *
     * @param {string} user_id
     * @returns {UserInfo | undefined }
     */
    getUserInfoByUserId(user_id) {
        return cache.user_info.find((e) => e.id == user_id);
    }

    /**
     *
     * @returns {UserInfo[]}
     */
    getAllUserInfo() {
        return cache.user_info;
    }

    /**
     *
     * @param {string} user_id
     */
    deleteUserById(user_id) {
        const index = cache.user_info.findIndex((e) => e.id == user_id);
        cache.user_info.splice(index, 1);
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {UserInfo | undefined}
     */
    getUserInfoByUserNameAndPassword(email, password) {
        const user_info = cache.user_info.find(
            (e) => e.email == email && e.passwd == password,
        );
        return user_info;
    }

    /**
     * admin dùng để trực tiếp thêm vào database
     *
     * @param {UserInfo} data
     */
    addUserInfo(data) {
        cache.user_info.unshift(data);
    }

    /**
     *
     * được dùng cho người dùng khi tạo tài khoản
     *
     * @param {string} password
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    createUserInfo(password, display_name, std, email) {
        const user_id = uuidv4();
        cache.user_info.push({
            id: user_id,
            name: display_name,
            email,
            passwd: password,
            phone_num: std,
            rule: 'user',
        });
    }

    /**
     *
     * @param {string} id
     * @param {string} email
     * @param {string} name
     * @param {string} passwd
     * @param {string} phone_num
     * @param {"user" | "admin"| undefined} rule
     */
    updateUserInfo(id, email, name, passwd, phone_num, rule) {
        const newUser = {
            id,
            email,
            name,
            passwd,
            phone_num,
            rule,
        };

        const index = cache.user_info.findIndex((e) => e.id === id);
        cache.user_info[index] = newUser;
    }

    /**
     *
     * @returns {Sach[]}
     */
    getAllSach() {
        return cache.sach;
    }

    /**
     *
     * @param {string} sach_id
     * @returns {Sach | undefined}
     */
    getSachById(sach_id) {
        return cache.sach.find((e) => e.id == sach_id);
    }

    /**
     *
     * @param {Sach} data
     */
    addSach(data) {
        const sach_id = uuidv4();
        data.id = sach_id;
        cache.sach.push(data);
    }

    /**
     * @param {Sach} data
     */
    updateSach(data) {
        const index = cache.sach.findIndex((e) => e.id == data.id);
        cache.sach[index] = data;
    }

    /**
     *
     * @param {string} sach_id
     */
    deleteSachById(sach_id) {
        const index = cache.sach.findIndex((e) => e.id == sach_id);
        cache.sach.splice(index, 1);
    }

    /**
     *
     * @returns {Cart[]}
     */
    getALlCart() {
        return cache.cart;
    }

    /**
     *
     * @param {string} user_id
     * @returns {Cart[]}
     */
    getCartByUserId(user_id) {
        return cache.cart.filter((e) => e.user_id == user_id);
    }

    /**
     *
     * @param {string} cart_id
     * @param {"suly" | "doixacnhan" | "thanhcong"} status
     */
    updateCartStatus(cart_id, status) {
        const index = cache.cart.findIndex((e) => e.id == cart_id);
        cache.cart[index].status = status;
    }

    /**
     *
     * @returns {Category[]}
     */
    getAllCategory() {
        return cache.category;
    }

    /**
     *
     * @returns {imgStore[]}
     */
    getAllImgs() {
        return cache.imgs;
    }

    /**
     *
     * @param {string} id
     * @returns {imgStore | undefined}
     */
    getImgById(id) {
        return cache.imgs.find((e) => e.id == id);
    }

    /**
     *
     * @param {imgStore} img
     */
    addImg(img) {
        const id = uuidv4();
        img.id = id;
        cache.imgs.push(img);
    }

    /**
     *
     * @param {imgStore} img
     */
    updateImg(img) {
        const index = cache.imgs.findIndex((e) => (e.id = img.id));
        cache.imgs[index] = img;
    }
}

const fackDatabase = new FakeDatabase();
export default fackDatabase;

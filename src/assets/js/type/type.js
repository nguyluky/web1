/**
 * 
 * @typedef {{
*     Id:        string;
*     Name:      string;
*     Districts: District[];
* }} Address 
* @typedef {{
*     Id:    string;
*     Name:  string;
*     Wards: Ward[];
* }} District
* @typedef {{
*     Id?:    string;
*     Name?:  string;
*     Level: Level;
* }} Ward

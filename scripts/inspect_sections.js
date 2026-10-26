const fs = require('fs');
const home = fs.readFileSync('data/home.html', 'utf8');

// Trust points details
const trustBlock = home.match(/Fast Shipping[\s\S]{0,1000}/);
console.log('--- Trust Block ---');
console.log(trustBlock ? trustBlock[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400) : 'none');

// About Us
const aboutBlock = home.match(/ABOUT US[\s\S]{0,800}/i);
console.log('\n--- About Us ---');
console.log(aboutBlock ? aboutBlock[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400) : 'none');

// CRAFTED FOR THE JOURNEY
const journeyBlock = home.match(/CRAFTED FOR THE JOURNEY[\s\S]{0,600}/i);
console.log('\n--- Crafted for Journey ---');
console.log(journeyBlock ? journeyBlock[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400) : 'none');

// CRAFTED WITH CHARACTER
const craftBlock = home.match(/CRAFTED WITH CHARACTER[\s\S]{0,600}/i);
console.log('\n--- Crafted with Character ---');
console.log(craftBlock ? craftBlock[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400) : 'none');

// Watch & Shop / Videos
const videoMatches = [...home.matchAll(/<video[^>]*>([\s\S]*?)<\/video>|<source[^>]+src="([^"]+)"|data-video="([^"]+)"/gi)];
console.log('\n--- Videos ---');
console.log('Video tags count:', videoMatches.length);
for (const m of videoMatches) {
  console.log('Video src:', m[0].slice(0, 100));
}

// Any mp4 / webm links in home.html
const mediaLinks = [...home.matchAll(/https?:\/\/[^"'\s]+\.(?:mp4|webm)/gi)].map(m => m[0]);
console.log('Media MP4/WEBM links:', mediaLinks);

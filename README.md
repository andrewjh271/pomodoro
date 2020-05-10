# Pomodoro Clock

This project was created as part of The Odin Project curriculum, and was a Pair Programming collaboration between [Andrew Hayhurst](https://github.com/andrewjh271) and [Aaron Contreras](https://github.com/aaron-contreras).

[Live Page](https://andrewjh271.github.io/pomodoro/)

### Functionality

- The two diamonds emulate an hourglass, transitioning from mostly blue on top / mostly magenta on bottom to the opposite during the course of a session. 
- Four circles keep track of the number of sessions completed, and restart on any click following a complete set of four.
- When a session or break have ended, an Extra Time counter appears above the main Timer to keep track of additional time.
-  The Play/Pause button will turn into a coffee mug once a session ends, or a pencil once a break ends. The user can click to begin either a break or new session, respectively.
- Session and Break titles will show text shadow and some subtle color animation when a session or break is active.
- Both the session and break ranges are limited to 1-59 minutes.

### Process

- The most challenging part was figuring out how to dynamically change the gradients of the two diamonds. There was an additional challenge in that the technique used to create the diamonds involved setting the gradient values in a :before pseudo-selector, which we could not access in Javascript. We settled on setting the gradient to a variable that was defined in the :root pseudo-class of CSS, and accessing it in Javascript this way:

```javascript
rootElement.style.setProperty('--linear-background-top',
    `linear-gradient(222deg, #02ddec -70%, #de1af8 ${colorVariable}%, #02ddec 120%)`);
```

- Choosing the values of the color gradients was surprisingly difficult. The stop values are unintuitive for me, and it was hard to map correctly because a good deal of the image is off screen. 
- We originally had the dynamic gradient working pretty well, updating in second increments, but it looked too choppy so we wanted to update the values more frequently. I ran into a lot of bugs deciding how to do that, and actually went back and forth between using the Interval that was updating the Timer and creating a new one.
- Making the diamonds was another difficulty. (Thank you to [web-tiki](https://stackoverflow.com/users/1811992/web-tiki) for the nice solution for making triangles.) We first just had rotated squares, but realized triangles would look better. The initial method of making a triangle using borders didn't work for us because we couldn't use gradients on the borders. The extra angles just came together nicely by setting `overflow: hidden` to the diamond container rather than the element itself (the original technique makes a triangle by showing only the :before element).
- The time aspect was a little tricky to implement, and a pain to debug. We settled on this method, which ensures the Date Object is set to 0 minutes and 0 seconds (the January 1 1970 is irrelevant), and then extracts the nice MM:SS part of the String.

```javascript
let date = new Date(0);
date.setSeconds(seconds);
date.toISOString().substr(14, 5);
```

### Thoughts

It was both of our first experiences with Pair Programming and using Visual Studio Code Live Share. It was a great experience for me learning new techniques and approaches while working together. Live Share worked really well and seems like it can be a powerful tool.

-Andrew Hayhurst


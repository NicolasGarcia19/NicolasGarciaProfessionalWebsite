// ============================================================================
// PROJECT DATA: edit this file to change everything on the Projects pages.
//
// projects.html builds its grid from this list, and project.html?p=<slug>
// builds each project's page from its entry. Delete an entry to remove a
// project, copy one to add a project. Keep each slug unique, with no spaces.
//
// Every project has:
//   slug      short id used in the page address (project.html?p=project-1)
//   template  'climb'  -> page with a horizontal climb (holds reveal steps)
//             'basic'  -> simpler page (route info, images, pitch tabs)
//   title     project name
//   summary   1-2 sentences shown on the card in the project grid
//   intro     short description shown at the top of the project page
//   image     card image + large image at the top of the page
//   tags      small badges under the description (optional)
//   links     buttons to GitHub, a demo, a report... (optional)
//
// 'climb' projects also have:
//   climbTitle, climbHint   optional heading / helper text over the climb
//   steps: [ { title, text, image?, stat? } ... ]
//     Each step becomes a hold, left to right = start to finish. Hovering or
//     tapping a hold opens its text (and image). Use 3-7 steps; colors run
//     from easy (yellow) to hard (black) automatically.
//     stat is an optional short result, like "12 fps -> 30 fps".
//
// 'basic' projects also have:
//   facts:   [ { label, value } ... ]               "Route info" boxes
//   images:  [ { src, caption } ... ]               1-3 images, click to enlarge
//   routeTitle, routeHint                           optional heading / helper text
//   pitches: [ { title, text } ... ]                tabs along a route; text can be
//                                                   one string or a list of paragraphs
//
// Everything below is placeholder text. Replace it with your own.
// ============================================================================

window.PROJECTS = [
  {
    slug: 'project-1',
    template: 'climb',
    title: 'PID Control of a 1D helicopter',
    summary: 'Demonstrated a tuned PID controller using IMU sensor data to accurately move a 1D helicopter to a certain hover angle.',
    intro: 'The goal of the project was to build and control a one-degree-of-freedom helicopter. A small drone motor is mounted on the end of a lever arm, and the other end of the arm is attached to a hinge, so the arm can only swing up and down. When the motor spins faster, its thrust lifts the arm to a higher angle. Our goal was to make the arm move to any angle the user asks for and hold it there. ',
    image: 'images/projects/project-1.png',
    tags: ['Embedded Systems', 'C', 'RP2350', 'Cornell - ECE 4760'],
    //links: [{ label: 'GitHub', href: 'https://github.com/NicolasGarcia19' }],
    climbHint: 'Each hold is a step along the process. Hover over a hold, or tap it, to see how the goal was reached.',
    steps: [
      { title: 'Starting point', text: 'We started by soldering together our provided circuit board that would manage the necessary connections and power control for the IMU and the motor.'},
      { title: 'Proportional Gain', text: 'Once the hardware and mechanical system was in place we started by designing the proportional control part of the system. We used this as a starting point in our tuning process.'},
      { title: 'Derivative Gain', text: 'We then implemented the derivative gain part of the system in order to remove the oscillations that we would see when trying to get to our target angle.' },
      { title: 'Integral Gain', text: 'Then in order to remove the steady state error we implemented the integral gain in order to finalize our PID controller. We also ensured to protect against integrator windup in our implementation. ' },
      { title: 'Final result', text: 'Finally we kept adjusting our values in order to get a snappy response to a new target angle where the helicopter didn\'t overshoot the target and settled in 1-3 seconds. ' }
    ]
  },
  {
    slug: 'project-2',
    template: 'climb',
    title: 'Digital Galton Board Optimization',
    summary: 'Tested the limits of process optimization on a RP2350 through optimizing the amount of balls animated on a 60fps VGA display with collision physics.',
    intro: 'The goal of this project was to use an RP2350 to build a digital Galton board and display it on a VGA screen. A Galton board is a board with rows of pegs where balls are dropped from the top, bounce off the pegs, and land in bins at the bottom. If enough balls fall, the number of balls in each bin forms a bell-shaped (Gaussian) curve. Our board has 16 rows of pegs (136 pegs total) and 17 bins. Each ball falls under gravity, and when it hits a peg, it bounces off using standard collision physics mimicking what would happen in reality. As balls pass the bottom row, they are counted into their bin, and a histogram under the board shows how many balls landed in each one. Once the system was designed the goal was to test how far the RP2350 could be pushed and how many balls could be animated on the VGA display while keeping up with the 60FPS requirement.',
    image: 'images/projects/project-2.jpg',
    tags: ['Embedded Systems', 'C', 'RP2350', 'Cornell - ECE 4760'],
    links: [],
    climbHint: 'Each hold is another optimization that was added onto the system. Hover over a hold, or tap it, to see how the optimizations progressed.',
    steps: [
      { title: 'Pre Optimization - Base Implementation 1100 balls', text: 'We started with only 1100 balls on our VGA display. This was without any optimizations and what the base implementation with one core of the RP2350 could do. The basic functionality that is shown at this point was correct collision physics, histogram drawing, and rotary encoder control for ball number.', image: 'images/projects/project-2-step-1.png' },
      { title: '8600 Balls', text: 'To get to this point we implemented some basic optimizations of splitting ball creation onto the 2 ARM cores on the RP2350. We also changed the display to only draw the outlines of the balls which gave us a large amount of time back. We then doubled our ball count by overclocking the RP2350 from its original clock speed of 150MHz to 300MHz.', image: 'images/projects/project-2-step-2.png' },
      { title: '10000 Balls', text: 'This was the maximum that we could achieve with time optimizations. These optimizations were decreasing the ball size which decreased the amount of pixels that we had to draw and writing our own drawing functions that didn\'t use any math and had hardcoded values. In addition to this we updated some of the calculations in order to use more efficient math.', image: 'images/projects/project-2-step-3.png'},
      { title: 'Final Result - 18000 Balls', text: 'Our memory optimization mainly included changing the amount of bits that were used in our VGA driver to send color information. By halving from 4 bit color to 2 bit color we were able to gain back a large part of our memory to use for more animation. This included rewriting the RP2350 PIO drivers. We also added more fixed point units in order to save as much room as possible.', image: 'images/projects/project-2-step-4.jpg' }
    ]
  },
  {
    slug: 'project-3',
    template: 'climb',
    title: 'Birdsong Synthesizer',
    summary: 'Using Direct Digital Synthesis(DDS) we developed a birdsong synthesizer that could record and playback frequency swoops.',
    intro: 'The goal of this project was to use a RP2350 to build a birdsong synthesizer in order to recreate one of the most common songs of a Northern Cardinal. This works because cardinal songs are tones that sweep across a frequency range that we can recreate using Direct Digital Synthesis(DDS). Then we send these frequency tones via SPI to a 12 bit DAC to play the tones. This system is controlled by user input through a slide potentiometer that can be used to record frequencies between 0 and 10k Hz and through a keypad that lets the user record, store, and playback custom frequency tone sequences.',
    image: 'images/projects/project-3.png',
    tags: ['Embedded Systems', 'C', 'RP2350', 'Cornell - ECE 4760'],
    links: [],
    steps: [
      { title: 'DAC & SPI', text: 'The first step in our plan was set up the DAC and the SPI correctly in order to be able to test our DDS implementation.' },
      { title: 'Slide Potentiometer', text: 'We then implemented a slide potentiometer that would control the tone that was being outputted by the DAC. This gave us the system necessary to add all of the other features.' },
      { title: 'Keypad', text: 'Then we implemented a keypad in order to store recordings of frequency swoops by using the \'*\' key as a way to enter record mode. This section required us adding debouncing to the software behind our keypad implementation.'},
      { title: 'Compose Mode', text: 'Finally we added a "compose" mode to the system where you could string together different recordings that have been saved. This used the \'#\' key as a way to enter that mode and we used this mode in order to string together the swoops/chirps in order to imitate one of the Northern Cardinals birdsongs.' },
    ]
  },
  {
    slug: 'project-4',
    template: 'basic',
    title: 'Single-Cycle Microprocessor on FPGA',
    summary: 'Implemented a single cycle microprocessor in Verilog that can execute multiple instruction programs with branching and halting functionality.',
    intro: 'This project is a complete single-cycle microprocessor design in Verilog through the Intel Quartus software for FPGA use. The key components are a CPU with a program counter, instruction memory, register file, an arithmetic logic unit (ALU), and data memory (RAM). ',
    image: 'images/projects/project-4.png',
    tags: ['Computer Architecture', 'Verilog', 'FPGA', 'Cornell - ECE 2300'],
    links: [],
    pitches: [
      { title: 'The problem', text: 'Placeholder' },
      { title: 'The approach', text: ['Placeholder'] },
      { title: 'The result', text: 'Placeholder' }
    ]
  },
  {
    slug: 'project-5',
    template: 'basic',
    title: 'Portfolio Optimization with Binary Classification',
    summary: 'Built a two stage convex optimization pipeline that used binary classification to improve risk adjusted returns on a selected number of stocks.',
    intro: 'The main question that I wanted an answer to was "Can a binary classifier trained on historical market features improve portfolio performance when its predictions are integrated into an optimization model that balances return and risk?". Using python and financial data we would be able to find the answer to this with a two stage optimization pipeline.',
    image: 'images/projects/project-5.png',
    tags: ['Convex Optimization', 'Python', 'Cornell - ECE 4800'],
    links: [],
    pitches: [
      { title: 'The problem', text: 'Can we use convex optimization techniques in order to improve returns on a 14 stock sample while using around 7 years of historical data. We compare it to an equal weight portfolio and return only portfolio on those same stocks at the same time. ' },
      { title: 'The approach', text: 'The first half of my implementation was a standard binary classification pipeline that predicted if the next days returns would be non negative. I used a weighted logistic loss funciton that included L2 regularization in order to stay within the bounds of convex optimization. The second stage of the pipeline was a portfolio optimization pipeline that balances the expected return with the predicted risk in order to protect against volatile stocks. ' },
      { title: 'The result', text: 'We split up our 7 years of data into 5 years of training and 2 years of testing. Due to the difficulty of predicting short-term financial returns my pipeline resulted in the range of 50%-55% accuracy, which is considered realistic in finance literature. When comparing to the other portfolio styles we found that the pipeline resulted in the most returns with 288% returns over the two years. It had around 2.3% daily volatility and a Sharpe Ratio of 2.179.' }
    ]
  },
  {
    slug: 'project-6',
    template: 'basic',
    title: 'Handwriting Recognition System ',
    summary: 'Built a handwriting recognition system using modular design and templated data structures for flexibility.',
    intro: 'Placeholder short description.',
    image: 'images/projects/project-6.png',
    tags: ['C/C++', 'Cornell - ECE 2400'],
    links: [],
    pitches: [
      { title: 'The problem', text: 'Placeholder text.' },
      { title: 'The approach', text: 'Placeholder text.' },
      { title: 'The result', text: 'Placeholder text.' }
    ]
  }
];

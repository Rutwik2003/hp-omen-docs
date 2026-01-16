import { DocPage } from '../types/docs';

export const PLAYGROUND_GUIDE: DocPage = {
    id: 'playground-example',
    title: 'Visual Editor Playground',
    description: 'This is an example guide to demonstrate the capabilities of the OMEN Visual Editor. Feel free to edit anything - changes are NOT saved!',
    category: 'Example',
    metadata: {
        difficulty: 'Intermediate',
        readTime: '10 min',
        lastUpdated: 'Just Now'
    },
    breadcrumbs: [
        { label: 'Playground' },
        { label: 'Example Guide' }
    ],
    steps: [
        {
            id: 'step-1',
            title: 'Welcome to the Editor',
            content: '',
            blocks: [
                {
                    id: 'b1',
                    type: 'callout',
                    variant: 'info',
                    title: 'Playground Mode',
                    content: '<p>You are currently in <strong>Playground Mode</strong>. This means you can mess around, break things, and experiment without affecting any live documentation.</p>'
                },
                {
                    id: 'b2',
                    type: 'text',
                    content: '<p>This editor allows you to build complex documentation using a block-based approach. You can drag and drop blocks, nest them, and configure them individually.</p>'
                },
                {
                    id: 'b3',
                    type: 'heading',
                    level: 2,
                    content: 'Rich Text Formatting'
                },
                {
                    id: 'b4',
                    type: 'text',
                    content: '<p>We support <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and <code>inline code</code>. You can also create lists:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>'
                }
            ]
        },
        {
            id: 'step-2',
            title: 'Advanced Layouts (Grids)',
            content: '',
            blocks: [
                {
                    id: 'b5',
                    type: 'text',
                    content: '<p>One of the most powerful features is the <strong>Grid Block</strong>, allowing you to create multi-column layouts.</p>'
                },
                {
                    id: 'grid-1',
                    type: 'grid',
                    columns: 2,
                    children: [
                        {
                            id: 'col-1',
                            parentId: 'grid-1',
                            type: 'column',
                            children: [
                                {
                                    id: 'b6',
                                    type: 'heading',
                                    level: 3,
                                    content: 'Left Column',
                                    parentId: 'col-1'
                                },
                                {
                                    id: 'b7',
                                    type: 'text',
                                    content: '<p>This column contains text and a callout.</p>',
                                    parentId: 'col-1'
                                },
                                {
                                    id: 'b8',
                                    type: 'callout',
                                    variant: 'tip',
                                    content: '<p>Grids are great for side-by-side comparisons.</p>',
                                    parentId: 'col-1'
                                }
                            ]
                        },
                        {
                            id: 'col-2',
                            parentId: 'grid-1',
                            type: 'column',
                            children: [
                                {
                                    id: 'b9',
                                    type: 'heading',
                                    level: 3,
                                    content: 'Right Column',
                                    parentId: 'col-2'
                                },
                                {
                                    id: 'b10',
                                    type: 'code',
                                    language: 'json',
                                    code: '{\n  "status": "active",\n  "column": "right"\n}',
                                    parentId: 'col-2'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'step-3',
            title: 'Technical Documentation',
            content: '',
            blocks: [
                {
                    id: 'b11',
                    type: 'heading',
                    level: 2,
                    content: 'Code Blocks & Tables'
                },
                {
                    id: 'b12',
                    type: 'text',
                    content: '<p>For technical guides, you often need to show configuration files or data tables.</p>'
                },
                {
                    id: 'b13',
                    type: 'code',
                    language: 'javascript',
                    filename: 'config.js',
                    code: 'const config = {\n  optimization: "enabled",\n  gpu_scheduling: true,\n  power_plan: "high_performance"\n};\n\nmodule.exports = config;'
                },
                {
                    id: 'b14',
                    type: 'table',
                    content: {
                        headers: ['Setting', 'Value', 'Impact'],
                        rows: [
                            ['Texture Quality', 'High', 'Medium'],
                            ['Shadows', 'Low', 'High'],
                            ['Ray Tracing', 'Off', 'Very High']
                        ]
                    }
                }
            ]
        }, // Closed Step 3, Commas added
        {
            id: 'step-4',
            title: 'Real-World Example: Hall Sensor Fix',
            content: '',
            blocks: [
                {
                    id: 'b15',
                    type: 'callout',
                    variant: 'danger',
                    title: 'Warning',
                    content: '<p>This modification involves opening your laptop and physically disconnecting a cable. <strong>Proceed at your own risk.</strong></p>'
                },
                {
                    id: 'b16',
                    type: 'text',
                    content: '<p>The "Black Screen" issue on 2023 models is often caused by a faulty Hall Sensor ribbon cable. Here is how to address it:</p>'
                },
                {
                    id: 'grid-2',
                    type: 'grid',
                    columns: 2,
                    children: [
                        {
                            id: 'g2-c1',
                            parentId: 'grid-2',
                            type: 'column',
                            children: [
                                {
                                    id: 'b17',
                                    type: 'heading',
                                    level: 3,
                                    content: 'Step 1: Identify the Cable',
                                    parentId: 'g2-c1'
                                },
                                {
                                    id: 'b18',
                                    type: 'text',
                                    content: '<p>Locate the small ribbon cable near the power button board. It connects the sensor to the mainboard.</p>',
                                    parentId: 'g2-c1'
                                }
                            ]
                        },
                        {
                            id: 'g2-c2',
                            parentId: 'grid-2',
                            type: 'column',
                            children: [
                                {
                                    id: 'b19',
                                    type: 'heading',
                                    level: 3,
                                    content: 'Step 2: Disconnect',
                                    parentId: 'g2-c2'
                                },
                                {
                                    id: 'b20',
                                    type: 'callout',
                                    variant: 'tip',
                                    content: '<p>Use plastic tools to gently lift the locking latch before pulling the cable.</p>',
                                    parentId: 'g2-c2'
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        {
            id: 'step-6',
            title: 'Gaming Setup Guide',
            content: '',
            blocks: [
                {
                    id: 'b25',
                    type: 'text',
                    content: '<p>A proper gaming setup starts with ensuring your GPU is delivering maximum frames. Follow the steps below for your specific hardware.</p>'
                },
                {
                    id: 'grid-3',
                    type: 'grid',
                    columns: 2,
                    children: [
                        {
                            id: 'g3-c1',
                            parentId: 'grid-3',
                            type: 'column',
                            children: [
                                {
                                    id: 'b26',
                                    type: 'heading',
                                    level: 3,
                                    content: 'NVIDIA Settings',
                                    parentId: 'g3-c1'
                                },
                                {
                                    id: 'b27',
                                    type: 'text',
                                    content: '<ul><li>Open <strong>NVIDIA Control Panel</strong></li><li>Go to <em>Manage 3D Settings</em></li><li>Set Power Management to <strong>Prefer Maximum Performance</strong></li></ul>',
                                    parentId: 'g3-c1'
                                }
                            ]
                        },
                        {
                            id: 'g3-c2',
                            parentId: 'grid-3',
                            type: 'column',
                            children: [
                                {
                                    id: 'b28',
                                    type: 'heading',
                                    level: 3,
                                    content: 'AMD Settings',
                                    parentId: 'g3-c2'
                                },
                                {
                                    id: 'b29',
                                    type: 'text',
                                    content: '<ul><li>Open <strong>AMD Adrenalin</strong></li><li>Navigate to <em>Gaming > Graphics</em></li><li>Enable <strong>Radeon Anti-Lag</strong></li></ul>',
                                    parentId: 'g3-c2'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 'step-7',
            title: 'Driver Management',
            content: '',
            blocks: [
                {
                    id: 'b30',
                    type: 'callout',
                    variant: 'warning',
                    title: 'Clean Installation',
                    content: '<p>Standard driver updates can sometimes leave corrupt files. We recommend using <strong>Display Driver Uninstaller (DDU)</strong> for a clean slate.</p>'
                },
                {
                    id: 'b31',
                    type: 'heading',
                    level: 3,
                    content: 'Recommended Update Order'
                },
                {
                    id: 'b32',
                    type: 'text',
                    content: '<ol><li>Chipset Drivers (AMD/Intel)</li><li>Integrated Graphics (Before Dedicated)</li><li>NVIDIA/AMD Dedicated Graphics</li><li>Audio & Network Drivers</li></ol>'
                }
            ]
        }
    ]
};

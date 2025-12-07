---
sidebar_position: 10
---
# Chapter 10: Real Project: Controlling a Humanoid Joint with ROS 2

### Introduction
This chapter brings together the concepts learned throughout the module by implementing a mini-project: controlling a single joint of a simulated humanoid robot. We will integrate nodes, topics, URDF, and TF2 to create a functional control loop, demonstrating the practical application of ROS 2 in embodied robotics.

### Main Sections
*   **Project Overview: Goal, Components, and Architecture**
    *   **Goal:** Control a single revolute joint of a simulated humanoid arm to move to desired angles.
    *   **Key Components:**
        *   A command publisher node.
        *   A joint controller node.
        *   A simulated robot model (using URDF and `robot_state_publisher`).
        *   Visualization in `RViz`.
*   **Setting up the Simulated Humanoid Joint**
    *   Reusing and extending the two-link arm URDF from Chapter 8 to represent a simplified humanoid arm.
    *   Ensuring `joint_state_publisher` and `robot_state_publisher` are running to provide joint state feedback and TF2 transforms.
*   **Designing the Control Node: Subscribing to Commands, Publishing Joint States**
    *   **`humanoid_joint_controller` node:**
        *   Subscribes to a command topic (e.g., `/joint_target_position` of type `std_msgs/Float64`).
        *   Simulates basic joint dynamics (e.g., simple proportional control to move towards the target).
        *   Publishes the simulated current joint position as `sensor_msgs/JointState` on `/joint_states`.
*   **Integrating Actuator Control (Simulated Hardware Interface)**
    *   The `humanoid_joint_controller` node acts as a simplified "hardware interface" for the simulated joint.\n    *   (Placeholder for future chapters: how a real hardware interface would connect to motors).\n*   **Basic Trajectory Generation for Joint Movement**
    *   Creating a `joint_command_publisher` node that sends a sequence of target positions to simulate a smooth trajectory (e.g., moving the arm up and down).\n*   [DIAGRAM: ROS 2 graph of the humanoid joint control system: command node -> control node -> robot model]
    *   A diagram showing `joint_command_publisher` sending commands to `humanoid_joint_controller`, which then influences the `robot_state_publisher` and visualization in `RViz`.\n*   [CODE EXAMPLE DESCRIPTION: `humanoid_joint_controller` node publishing `JointState` and subscribing to `Float64` command]
    *   The Python code for the controller node, demonstrating subscription to a command topic and publishing `JointState` messages.\n
### Practical Assignment
**Humanoid Joint Trajectory:**\n1.  Extend your `two_link_arm.urdf` from Chapter 8 to represent a simple shoulder-elbow joint for a humanoid arm.\n2.  Create the `humanoid_joint_controller` node as described above, for one of the revolute joints. Make it subscribe to `/shoulder_joint_command` (`std_msgs/Float64`) and publish its simulated current position to `/joint_states`.\n3.  Create a `joint_command_publisher` node that publishes a sequence of target angles to `/shoulder_joint_command` to make the shoulder joint move through a predefined trajectory (e.g., move from 0 to -1.57 radians and back).\n4.  Launch all necessary nodes (`joint_command_publisher`, `humanoid_joint_controller`, `joint_state_publisher`, `robot_state_publisher`, `RViz`) and observe the joint's movement in `RViz`.\n
### Quiz\n1.  In this humanoid joint control project, what is the primary role of the `humanoid_joint_controller` node?\n    a) To generate complex motion plans for the entire robot\n    b) To translate desired joint positions into simulated motor commands and publish current states\n    c) To visualize the robot's environment in 3D\n    d) To process raw sensor data from a camera\n2.  What ROS 2 message type would the `humanoid_joint_controller` node publish to communicate its current joint position to other parts of the system (like `robot_state_publisher`)?\n
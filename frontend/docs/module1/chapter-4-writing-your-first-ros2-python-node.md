---
sidebar_position: 4
---
# Chapter 4: Writing Your First ROS 2 Python Node: A Hands-on Introduction

### Introduction
Building on the theoretical understanding of nodes and topics, this chapter provides a hands-on guide to writing, compiling, and running your very first ROS 2 nodes using Python. We will cover the necessary package structure and the key Python APIs for creating publishers and subscribers.

### Main Sections
*   **Python and ROS 2: Setting up Your Development Environment**
    *   Python version compatibility with ROS 2.
    *   Recommended virtual environment setup.
    *   Importing `rclpy` (ROS Client Library for Python).
*   **Structure of a ROS 2 Python Package**
    *   `package.xml`: Defining package metadata and dependencies.
    *   `setup.py` and `setup.cfg`: Configuring Python-specific build and installation.
    *   The `resource` and `share` directories.
*   **Creating a Publisher Node in Python: Step-by-step**
    *   Initializing `rclpy`.
    *   Creating a node object.
    *   Declaring a publisher for a specific message type and topic.
    *   Creating a loop to publish messages periodically.
    *   Logging within a ROS 2 node.
*   **Creating a Subscriber Node in Python: Step-by-step**
    *   Initializing `rclpy` and creating a node.
    *   Declaring a subscriber and defining a callback function.
    *   Spinning the node to process incoming messages.
*   **Building and Running ROS 2 Python Nodes**
    *   Updating `setup.py` to define executables.
    *   Using `colcon build` to compile the package.
    *   Sourcing the workspace.
    *   Running nodes with `ros2 run <package_name> <executable_name>`.
*   [CODE EXAMPLE DESCRIPTION: Full Python publisher node code]
    *   The complete Python code for a `talker` node.
*   [CODE EXAMPLE DESCRIPTION: Full Python subscriber node code]
    *   The complete Python code for a `listener` node.

### Practical Assignment
**Custom Message Type Communication:**\n1.  Define a custom ROS 2 message type, `Count.msg`, with a single integer field (e.g., `int32 count`).\n2.  Modify your `talker_node` to publish `Count` messages, incrementing the `count` field.\n3.  Modify your `listener_node` to subscribe to `Count` messages and print the received `count` value.\n4.  Ensure both nodes correctly build and communicate using your custom message.\n
### Quiz\n1.  What is the main role of the `rclpy` library in ROS 2 Python development?\n2.  If you have written a new Python node in your ROS 2 package, what steps must you take to make it runnable using `ros2 run`?\n
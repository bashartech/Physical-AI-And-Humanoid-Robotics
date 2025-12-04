---
sidebar_position: 3
---
# Chapter 3: Understanding Nodes & Topics: The Basic Communication Paradigm

### Introduction
This chapter focuses on the most fundamental communication mechanisms in ROS 2: nodes and topics. We will explore how nodes publish data to topics and how other nodes subscribe to receive that data, forming the backbone of inter-component communication in a robot system.

### Main Sections
*   **Nodes: The Executable Units of a Robot**
    *   Definition and role of a node in a ROS 2 system.
    *   How nodes provide modularity and encapsulation.
    *   Lifecycle of a node: initialization, execution, shutdown.
*   **Topics: The Asynchronous Data Streams**
    *   **Publishers:** Nodes that send data messages to a specific topic.
    *   **Subscribers:** Nodes that receive data messages from a specific topic.
    *   The many-to-many, asynchronous nature of topics.
    *   Example scenarios: sensor data, actuator commands, status updates.
*   **Message Types: Defining the Data Structure**
    *   Standard ROS 2 message types (e.g., `std_msgs`, `sensor_msgs`).
    *   Defining custom message types (`.msg` files).
    *   Serialization and deserialization of messages.
*   **Visualizing Communication: `rqt_graph` and `ros2 topic` commands**
    *   `rqt_graph`: A powerful GUI tool to visualize the ROS 2 computation graph (nodes and topics).
    *   `ros2 topic list`: Listing active topics.
    *   `ros2 topic info <topic_name>`: Getting details about a topic.
    *   `ros2 topic echo <topic_name>`: Displaying messages published on a topic.
    *   `ros2 topic pub <topic_name> <msg_type> <args>`: Manually publishing messages.
*   [DIAGRAM: ROS 2 Node Communication Flow with Publisher/Subscriber]
    *   A diagram showing two nodes, one publishing to a topic and another subscribing, with data flowing through the topic.
*   [CODE EXAMPLE DESCRIPTION: Simple Python publisher node]
    *   A description of a Python node that creates a publisher and sends a basic string message periodically.
*   [CODE EXAMPLE DESCRIPTION: Simple Python subscriber node]
    *   A description of a Python node that creates a subscriber and prints incoming string messages.

### Practical Assignment
**Basic Publisher/Subscriber:** In your `my_first_package`, create two Python nodes:\n1.  `talker_node`: Publishes the string "Hello, ROS 2!" with a counter on a topic named `/chatter` at 1Hz.\n2.  `listener_node`: Subscribes to the `/chatter` topic and prints the received messages to the console.\nUse `ros2 topic echo` to verify communication.\n
### Quiz
1.  What is the primary difference between a ROS 2 publisher and a ROS 2 subscriber?\n2.  Which ROS 2 command-line tool would you use to visually inspect the connections between nodes and topics in a running system?\n
# Performance Testing Script

This script will test the system's performance under load with 100 concurrent users.

## Test Scenarios

### 1. Personalization API Load Test
- Simulate 100 concurrent users requesting content personalization
- Measure response times and error rates
- Verify caching effectiveness

### 2. Translation API Load Test
- Simulate 100 concurrent users requesting content translation
- Measure response times and error rates
- Verify formatting preservation under load

### 3. Chat API Load Test
- Simulate 100 concurrent users making chat requests
- Measure response times and error rates
- Verify RAG functionality under load

## Test Implementation

```python
import asyncio
import aiohttp
import time
import json
from typing import List, Dict, Any

class PerformanceTester:
    def __init__(self, base_url: str, num_concurrent_users: int = 100):
        self.base_url = base_url
        self.num_concurrent_users = num_concurrent_users
        self.session = None

    async def setup_session(self):
        self.session = aiohttp.ClientSession()

    async def close_session(self):
        if self.session:
            await self.session.close()

    async def test_personalization_endpoint(self, content: str, user_id: int):
        """Test personalization endpoint with concurrent users"""
        start_time = time.time()
        try:
            async with self.session.post(
                f"{self.base_url}/personalize",
                json={
                    "chapter_path": f"test_chapter_{user_id}",
                    "raw_md": content,
                    "jwt_token": f"fake_token_for_user_{user_id}"
                },
                headers={"Content-Type": "application/json"}
            ) as response:
                result = await response.json()
                response_time = time.time() - start_time
                return {
                    "user_id": user_id,
                    "status": response.status,
                    "response_time": response_time,
                    "success": response.ok
                }
        except Exception as e:
            response_time = time.time() - start_time
            return {
                "user_id": user_id,
                "status": "error",
                "response_time": response_time,
                "success": False,
                "error": str(e)
            }

    async def test_translation_endpoint(self, content: str, user_id: int):
        """Test translation endpoint with concurrent users"""
        start_time = time.time()
        try:
            async with self.session.post(
                f"{self.base_url}/translate",
                json={
                    "chapter_path": f"test_chapter_{user_id}",
                    "raw_md": content,
                    "target_language": "ur",
                    "jwt_token": f"fake_token_for_user_{user_id}"
                },
                headers={"Content-Type": "application/json"}
            ) as response:
                result = await response.json()
                response_time = time.time() - start_time
                return {
                    "user_id": user_id,
                    "status": response.status,
                    "response_time": response_time,
                    "success": response.ok
                }
        except Exception as e:
            response_time = time.time() - start_time
            return {
                "user_id": user_id,
                "status": "error",
                "response_time": response_time,
                "success": False,
                "error": str(e)
            }

    async def test_chat_endpoint(self, query: str, user_id: int):
        """Test chat endpoint with concurrent users"""
        start_time = time.time()
        try:
            async with self.session.post(
                f"{self.base_url}/chat",
                json={
                    "query": query,
                    "jwt_token": f"fake_token_for_user_{user_id}"
                },
                headers={"Content-Type": "application/json"}
            ) as response:
                result = await response.json()
                response_time = time.time() - start_time
                return {
                    "user_id": user_id,
                    "status": response.status,
                    "response_time": response_time,
                    "success": response.ok
                }
        except Exception as e:
            response_time = time.time() - start_time
            return {
                "user_id": user_id,
                "status": "error",
                "response_time": response_time,
                "success": False,
                "error": str(e)
            }

    async def run_concurrent_test(self, test_func, test_data, *args):
        """Run concurrent tests and collect results"""
        await self.setup_session()

        # Create tasks for concurrent execution
        tasks = [
            test_func(test_data, i)
            for i in range(self.num_concurrent_users)
        ]

        # Execute all tasks concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        await self.close_session()
        return results

    def analyze_results(self, results: List[Dict[str, Any]], test_name: str):
        """Analyze test results and generate report"""
        successful_requests = [r for r in results if r.get('success', False)]
        failed_requests = [r for r in results if not r.get('success', False)]

        if successful_requests:
            avg_response_time = sum(r['response_time'] for r in successful_requests) / len(successful_requests)
            max_response_time = max(r['response_time'] for r in successful_requests)
            min_response_time = min(r['response_time'] for r in successful_requests)
        else:
            avg_response_time = max_response_time = min_response_time = 0

        print(f"\n=== {test_name} Performance Test Results ===")
        print(f"Total Requests: {len(results)}")
        print(f"Successful Requests: {len(successful_requests)}")
        print(f"Failed Requests: {len(failed_requests)}")
        print(f"Success Rate: {len(successful_requests)/len(results)*100:.2f}%")
        print(f"Average Response Time: {avg_response_time:.2f}s")
        print(f"Min Response Time: {min_response_time:.2f}s")
        print(f"Max Response Time: {max_response_time:.2f}s")

        # Check against performance targets
        print("\nPerformance Targets Check:")
        print(f"  Personalization/Translation Target: <8s - {'PASS' if avg_response_time < 8 else 'FAIL'}")
        print(f"  Chat Target: <3s - {'PASS' if avg_response_time < 3 else 'FAIL'}")

        if failed_requests:
            print(f"\nFailed Requests Summary:")
            for i, req in enumerate(failed_requests[:5]):  # Show first 5 failures
                print(f"  Request {req.get('user_id', 'unknown')}: {req.get('error', 'Unknown error')}")

    async def run_full_performance_test(self):
        """Run all performance tests"""
        print(f"Starting performance test with {self.num_concurrent_users} concurrent users...")

        # Test content
        test_content = "# Test Chapter\n\nThis is a test chapter for performance testing. " + \
                      "It contains multiple paragraphs to test the personalization and translation systems. " + \
                      "The content should be processed efficiently even under load conditions."
        test_query = "What is this chapter about?"

        # Run personalization test
        print("\nRunning Personalization Performance Test...")
        personalization_results = await self.run_concurrent_test(
            self.test_personalization_endpoint,
            test_content
        )
        self.analyze_results(personalization_results, "Personalization")

        # Run translation test
        print("\nRunning Translation Performance Test...")
        translation_results = await self.run_concurrent_test(
            self.test_translation_endpoint,
            test_content
        )
        self.analyze_results(translation_results, "Translation")

        # Run chat test
        print("\nRunning Chat Performance Test...")
        chat_results = await self.run_concurrent_test(
            self.test_chat_endpoint,
            test_query
        )
        self.analyze_results(chat_results, "Chat")

# Example usage
async def main():
    tester = PerformanceTester("http://localhost:8000", num_concurrent_users=100)
    await tester.run_full_performance_test()

if __name__ == "__main__":
    asyncio.run(main())
```

## Running the Performance Tests

To execute the performance tests:

1. Make sure the backend service is running on localhost:8000
2. Install required dependencies: `pip install aiohttp`
3. Run the script: `python performance_test.py`

## Expected Results

The system should handle 100 concurrent users with:
- Personalization and translation responses under 8 seconds
- Chat responses under 3 seconds
- Success rate above 95%
- Proper error handling for failed requests

## Performance Optimization Recommendations

Based on the test results, consider these optimizations:

1. **Caching Strategy**: Implement Redis or similar for frequently accessed personalized content
2. **Database Connection Pooling**: Optimize Neon DB connection handling
3. **API Rate Limiting**: Implement rate limiting to prevent system overload
4. **CDN Integration**: Use CDN for static content delivery
5. **Load Balancing**: Deploy multiple backend instances for horizontal scaling
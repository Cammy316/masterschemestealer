import asyncio
import json
import traceback
from routes.forge import rack_analysis, RackAnalysisRequest, get_opaque_paints

async def test():
    try:
        get_opaque_paints()
        req = RackAnalysisRequest(inventory=[])
        result = await rack_analysis(req)
        print("Success Empty!")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print("Error encountered:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())

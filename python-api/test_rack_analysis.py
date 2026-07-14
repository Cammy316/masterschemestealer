import asyncio
import json
import traceback
from routes.forge import rack_analysis, RackAnalysisRequest, get_opaque_paints

async def test():
    try:
        # Load the DB to cache it
        get_opaque_paints()
        
        req = RackAnalysisRequest(inventory=["vallejo-model-color-black", "citadel-mephiston-red"])
        result = await rack_analysis(req)
        print("Success!")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print("Error encountered:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())

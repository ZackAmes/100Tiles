#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="http://localhost:5050";

export WORLD_ADDRESS=$(cat ./manifests/dev/deployment/manifest.json | jq -r '.world.address')
export ACTIONS_ADDRESS=$(cat ./manifests/dev/deployment/manifest.json | jq -r '.contracts[] | select(.tag == "ok-actions" ).address')
export MATCHMAKING_ADDRESS=$(cat ./manifests/dev/deployment/manifest.json | jq -r '.contracts[] | select(.tag == "ok-matchmaking" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS
echo " "
echo actions : $ACTIONS_ADDRESS
echo matchmaking : $MATCHMAKING_ADDRESS
echo "---------------------------------------------------------------------------"

ACTIONS_COMPONENTS=("Position" "Game" "Tile" "Pending" "Moved")

for component in ${ACTIONS_COMPONENTS[@]}; do
    sozo auth grant --world $WORLD_ADDRESS --rpc-url $RPC_URL writer model:$component,$ACTIONS_ADDRESS 
done

echo "Actions authorizations have been successfully set."
echo "---------------------------------------------------------------------------"


MATCHMAKING_COMPONENTS=("Position" "Game")

for component in ${MATCHMAKING_COMPONENTS[@]}; do
    sozo auth grant --world $WORLD_ADDRESS --rpc-url $RPC_URL writer model:$component,$MATCHMAKING_ADDRESS 
done

echo "Matchmaking authorizations have been successfully set."
echo "---------------------------------------------------------------------------"
